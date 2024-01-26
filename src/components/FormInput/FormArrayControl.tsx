//@ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 10th 2024, 9:39:18 am
 * Author: Nagendra S @ valmi.io
 */

import {
  ArrayLayoutProps,
  ControlElement,
  errorsAt,
  formatErrorMessage,
  JsonSchema,
  Paths,
  Resolve,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  encode,
  ArrayTranslations,
  createDefaultValue
} from '@jsonforms/core';

import { withJsonFormsArrayLayoutProps, useJsonForms, JsonFormsStateContext, DispatchCell } from '@jsonforms/react';
import { Box, FormHelperText, Grid, Hidden, IconButton, Paper, Stack, TableRow, Typography } from '@mui/material';
import { merge, startCase, union } from 'lodash';
import { NoBorderTableCell, WithDeleteDialogSupport } from '@jsonforms/material-renderers';
import React, { useCallback, useMemo, Fragment } from 'react';
import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';

import { ErrorObject } from 'ajv';

import {
  ErrorOutline as ErrorOutlineIcon,
  Add as AddIcon,
  ArrowDownward,
  Delete as DeleteIcon,
  ArrowUpward
} from '@mui/icons-material';
import { Badge, Tooltip, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }: any) => ({
  color: theme.palette.error.main
}));

export interface ValidationProps {
  errorMessages: string;
  id: string;
}

const ValidationIcon: React.FC<ValidationProps> = ({ errorMessages, id }) => {
  return (
    <Tooltip id={id} title={errorMessages}>
      <StyledBadge badgeContent={errorMessages.split('\n').length}>
        <ErrorOutlineIcon color="inherit" />
      </StyledBadge>
    </Tooltip>
  );
};

interface NonEmptyCellProps extends OwnPropsOfNonEmptyCell {
  rootSchema: JsonSchema;
  errors: string;
  path: string;
  enabled: boolean;
}
interface OwnPropsOfNonEmptyCell {
  rowPath: string;
  propName?: string;
  schema: JsonSchema;
  enabled: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}
const ctxToNonEmptyCellProps = (ctx: JsonFormsStateContext, ownProps: OwnPropsOfNonEmptyCell): NonEmptyCellProps => {
  const path = ownProps.rowPath + (ownProps.schema.type === 'object' ? '.' + ownProps.propName : '');
  const errors = formatErrorMessage(
    union(
      errorsAt(path, ownProps.schema, (p) => p === path)(ctx.core.errors).map((error: ErrorObject) => error.message)
    )
  );

  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: ctx.core.schema,
    errors,
    path,
    enabled: ownProps.enabled,
    cells: ownProps.cells || ctx.cells,
    renderers: ownProps.renderers || ctx.renderers
  };
};

interface NonEmptyCellComponentProps {
  path: string;
  propName?: string;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  errors: string;
  enabled: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  isValid: boolean;
}

const NonEmptyCellComponent = React.memo(function NonEmptyCellComponent({
  path,
  propName,
  schema,
  rootSchema,
  errors,
  enabled,
  renderers,
  cells,
  isValid
}: NonEmptyCellComponentProps) {
  return (
    <Stack style={{ display: 'flex', flexDirection: 'column' }}>
      {schema.properties ? (
        <DispatchCell
          schema={Resolve.schema(schema, `#/properties/${encode(propName)}`, rootSchema)}
          uischema={controlWithoutLabel(`#/properties/${encode(propName)}`)}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      ) : (
        <DispatchCell
          schema={schema}
          uischema={controlWithoutLabel('#')}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      )}
      <FormHelperText error={!isValid}>{!isValid && errors}</FormHelperText>
    </Stack>
  );
});

const controlWithoutLabel = (scope: string): ControlElement => ({
  type: 'Control',
  scope: scope,
  label: false
});

const NonEmptyCell = (ownProps: OwnPropsOfNonEmptyCell) => {
  const ctx = useJsonForms();
  const emptyCellProps = ctxToNonEmptyCellProps(ctx, ownProps);

  const isValid = isEmpty(emptyCellProps.errors);

  return <NonEmptyCellComponent {...emptyCellProps} isValid={isValid} />;
};

const generateCells = (
  Cell: React.ComponentType<OwnPropsOfNonEmptyCell>,
  schema: JsonSchema,
  rowPath: string,
  enabled: boolean,
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  if (schema.type === 'object') {
    return getValidColumnProps(schema).map((prop) => {
      const cellPath = Paths.compose(rowPath, prop);
      const props: OwnPropsOfNonEmptyCell = {
        propName: prop,
        schema,
        title: schema.properties?.[prop]?.title ?? startCase(prop),
        rowPath,
        cellPath,
        enabled,
        cells
      };

      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      rowPath,
      cellPath: rowPath,
      enabled
    };

    return <Cell key={rowPath} {...props} />;
  }
};

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowIndex: number;
  moveUpCreator: (path: string, position: number) => () => void;
  moveDownCreator: (path: string, position: number) => () => void;
  enableUp: boolean;
  enableDown: boolean;
  showSortButtons: boolean;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  path: string;
  translations: ArrayTranslations;
}

const NonEmptyRowComponent = ({
  childPath,
  schema,
  rowIndex,
  openDeleteDialog,
  moveUpCreator,
  moveDownCreator,
  enableUp,
  enableDown,
  showSortButtons,
  enabled,
  cells,
  path,
  translations
}: NonEmptyRowProps & WithDeleteDialogSupport) => {
  const moveUp = useMemo(() => moveUpCreator(path, rowIndex), [moveUpCreator, path, rowIndex]);
  const moveDown = useMemo(() => moveDownCreator(path, rowIndex), [moveDownCreator, path, rowIndex]);

  return (
    <Stack key={childPath}>
      <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} spacing={2}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            mx: 1.5
          }}
        >
          {generateCells(NonEmptyCell, schema, childPath, enabled, cells)}
        </Box>
        <Box>
          {enabled && (
            <Stack
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              {showSortButtons ? (
                <Fragment>
                  <Grid item>
                    <IconButton
                      aria-label={translations.upAriaLabel}
                      onClick={moveUp}
                      disabled={!enableUp}
                      size="large"
                    >
                      <ArrowUpward />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label={translations.downAriaLabel}
                      onClick={moveDown}
                      disabled={!enableDown}
                      size="large"
                    >
                      <ArrowDownward />
                    </IconButton>
                  </Grid>
                </Fragment>
              ) : null}

              <IconButton
                aria-label={translations.removeAriaLabel}
                onClick={() => openDeleteDialog(childPath, rowIndex)}
                size="large"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};
export const NonEmptyRow = React.memo(NonEmptyRowComponent);

interface TableRowsProp {
  data: number;
  path: string;
  schema: JsonSchema;
  uischema: ControlElement;
  config?: any;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  moveUp?(path: string, toMove: number): () => void;
  moveDown?(path: string, toMove: number): () => void;
  translations: ArrayTranslations;
}

const getValidColumnProps = (scopedSchema: JsonSchema) => {
  if (scopedSchema.type === 'object' && typeof scopedSchema.properties === 'object') {
    return Object.keys(scopedSchema.properties).filter((prop) => scopedSchema.properties[prop].type !== 'array');
  }
  // primitives
  return [''];
};

const TableRows = ({
  data,
  path,
  schema,
  openDeleteDialog,
  moveUp,
  moveDown,
  uischema,
  config,
  enabled,
  cells,
  translations
}: TableRowsProp & WithDeleteDialogSupport) => {
  const isEmptyTable = data === 0;

  if (isEmptyTable) {
    return (
      <Typography
        sx={{ color: (theme) => theme.colors.alpha.black[50], whiteSpace: 'nowrap', textAlign: 'center', padding: 3 }}
        variant="body2"
      >
        {translations.noDataMessage}
      </Typography>
    );
  }

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <React.Fragment>
      {range(data).map((index: number) => {
        const childPath = Paths.compose(path, `${index}`);

        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowIndex={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
            moveUpCreator={moveUp}
            moveDownCreator={moveDown}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={appliedUiSchemaOptions.showSortButtons || appliedUiSchemaOptions.showArrayTableSortButtons}
            enabled={enabled}
            cells={cells}
            path={path}
            translations={translations}
          />
        );
      })}
    </React.Fragment>
  );
};

export const FormArrayControl = (props: ArrayLayoutProps) => {
  const { visible, enabled, schema, label, path, errors, addItem, removeItems, translations } = props;

  const addItemCb = useCallback(
    (p: string, value: any) => {
      return addItem(p, value);
    },
    [addItem]
  );

  const deleteItemCb = useCallback(
    (p: string, rowIndex: number) => {
      const path = p.substring(0, p.lastIndexOf('.'));

      removeItems(path, [rowIndex])();
    },
    [removeItems]
  );

  return (
    <Hidden xsUp={!visible}>
      <Paper style={{ margin: 2 }} variant="outlined">
        <Stack
          sx={{ px: 1.5, pt: 1 }}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography style={{ whiteSpace: 'nowrap' }} variant={'body1'}>
            {label}
          </Typography>

          <Box
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {enabled && (
              <Tooltip id="tooltip-add" title={translations?.addTooltip ?? label} placement="bottom">
                <IconButton
                  aria-label={translations?.addAriaLabel ?? 'add domain button'}
                  onClick={addItemCb(path, createDefaultValue(schema))}
                  size="large"
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            {errors.length !== 0 && <ValidationIcon id="tooltip-validation" errorMessages={errors} />}
          </Box>
        </Stack>
        {/* {isObjectSchema && (
            <TableRow>
              {headerCells}
              {enabled ? <TableCell /> : null}
            </TableRow>
          )} */}
        <TableRows openDeleteDialog={deleteItemCb} translations={translations} {...props} />
      </Paper>
    </Hidden>
  );
};

export default withJsonFormsArrayLayoutProps(FormArrayControl);
