import React, { useCallback } from 'react';

import { styled, Chip, Stack, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import { TCatalog } from '@/utils/typings.d';

interface CatalogCardProps {
  catalog: TCatalog;
  handleCatalogOnClick: (data: TCatalog) => void;
}

const CardWrapper = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '144px',
  height: '144px',
  backgroundColor: theme.colors.secondary.lighter,
  position: 'relative'
}));

export const CatalogItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 0 8px',
  gap: theme.spacing(1),
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'transparent'
}));

const CardFooter = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
  width: '100%',
  position: 'absolute',
  right: 0,
  bottom: '-4px',
  backgroundColor: 'transparent'
}));

const ConnectionCountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.colors.secondary.main,
  color: theme.colors.alpha.white[100]
}));

const CatalogCard = ({ catalog, handleCatalogOnClick }: CatalogCardProps) => {
  const { connections = 0, display_name: displayName = '' } = catalog;

  const handleOnClick = useCallback(() => {
    handleCatalogOnClick(catalog);
  }, [catalog]);

  const catalogType: string = catalog.type.split('_').slice(1).join('_');

  const catalogIconSource = `/connectors/${catalogType.toLowerCase()}.svg`;

  return (
    <Grid item xs={'auto'}>
      <CardWrapper variant="outlined">
        <CatalogItem>
          <ImageComponent src={catalogIconSource} alt="connector" size={ImageSize.connectorCard} />
          <Typography variant="caption" textTransform={'uppercase'}>
            {displayName}
          </Typography>
          {!!connections && (
            <CardFooter>
              <ConnectionCountChip label={`+${connections}`} size="small" />
            </CardFooter>
          )}
        </CatalogItem>
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            opacity: 0,
            width: '100%',
            height: '100%',
            ':hover': {
              transition: 'all 0.3s',
              opacity: 1,
              borderRadius: 0,
              bgcolor: (theme) => theme.colors.alpha.black[50],
              color: (theme) => theme.colors.primary.main
            }
          }}
        >
          <IconButton color="primary" onClick={handleOnClick}>
            <CustomIcon
              style={{
                fontSize: ImageSize.large,
                backgroundColor: 'white',
                borderRadius: '100%'
              }}
              icon={appIcons.CIRCLE_PLUS_OUTLINED}
            />
          </IconButton>
        </Stack>
      </CardWrapper>
    </Grid>
  );
};

export default CatalogCard;
