import PopoverComponent from '@/components/Popover';
import VButton from '@/components/VButton';
import { Box, FormControl, MenuItem, Popover, Stack, TextField } from '@mui/material';

export interface Filter {
  db_column: string;
  display_column: string;
  column_type: string;
}

// Interface for operators
export interface Operator {
  [key: string]: string[];
}

// Interface for applied filters
export interface AppliedFilter {
  column: string;
  column_type: string;
  operator: string;
  value: string;
}

interface PopoverParams {
  handleClose: any;
  appliedFilters: AppliedFilter[];
  setAppliedFilters: any;
  filters: Filter[];
  standardOperators: Operator;
  handleSubmit: any;
}

const PromptPreviewFilter = ({
  handleClose,
  appliedFilters,
  setAppliedFilters,
  filters,
  standardOperators,
  handleSubmit
}: PopoverParams): any => {
  const updateExistingFilter = (index: number, field: any, value: string) => {
    const newAppliedFilters: any = [...appliedFilters];
    newAppliedFilters[index][field] = value;
    setAppliedFilters(newAppliedFilters);
  };

  const handleAddFilter = () => {
    setAppliedFilters([...appliedFilters, { column: '', column_type: '', operator: '', value: '' }]);
  };

  return (
    <Box sx={{ border: '1px solid black', p: 2 }} minWidth={600}>
      <Stack spacing={2} direction="column">
        {appliedFilters.map((appliedFilter, index) => {
          return (
            <Stack spacing={1} direction="row" key={index}>
              <FormControl fullWidth required>
                <TextField
                  size="small"
                  id="select-column"
                  value={appliedFilter.column}
                  label="Select Column"
                  select={true}
                  required
                  fullWidth
                  onChange={(event) => {
                    updateExistingFilter(index, 'column', event.target.value as string);
                    const filter = filters.find((filter) => filter.display_column === (event.target.value as string));
                    const columnType = filter ? filter.column_type : 'string';
                    updateExistingFilter(index, 'column_type', columnType);
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                >
                  {filters.map((filter, index) => (
                    <MenuItem key={filter.display_column} value={filter.display_column}>
                      {filter.display_column}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              <FormControl fullWidth required>
                <TextField
                  size="small"
                  id="select-operator"
                  value={appliedFilter.operator}
                  label="Select Operator"
                  select={true}
                  required
                  fullWidth
                  onChange={(event) => {
                    updateExistingFilter(index, 'operator', event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                >
                  {appliedFilter.column_type
                    ? standardOperators[appliedFilter.column_type]?.map((op) => (
                        <MenuItem key={op} value={op}>
                          {op}
                        </MenuItem>
                      ))
                    : []}
                  []
                </TextField>
              </FormControl>

              <TextField
                size="small"
                value={appliedFilter.value}
                onChange={(event) => updateExistingFilter(index, 'value', event.target.value as string)}
                placeholder="Enter value"
              />
            </Stack>
          );
        })}

        <Stack spacing={1} direction="row" sx={{ justifyContent: 'space-between' }}>
          <VButton
            buttonText={'+ ADD'}
            buttonType="submit"
            endIcon={false}
            onClick={handleAddFilter}
            size="small"
            disabled={false}
            variant="text"
          />

          <Stack spacing={1} direction="row">
            <VButton
              buttonText={'CANCEL'}
              buttonType="submit"
              endIcon={false}
              startIcon={false}
              onClick={handleClose}
              size="small"
              disabled={false}
              variant="text"
            />

            <VButton
              buttonText={'APPLY'}
              buttonType="submit"
              endIcon={false}
              startIcon={false}
              onClick={() => {
                handleClose();
                handleSubmit();
              }}
              size="small"
              disabled={false}
              variant="text"
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <div>
      {/* <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ border: '1px solid black', p: 2 }} minWidth={600}>
          <Stack spacing={2} direction="column">
            {appliedFilters.map((appliedFilter, index) => {
              return (
                <Stack spacing={1} direction="row" key={index}>
                  <FormControl fullWidth required>
                    <TextField
                      size="small"
                      id="select-column"
                      value={appliedFilter.column}
                      label="Select Column"
                      select={true}
                      required
                      fullWidth
                      onChange={(event) => {
                        updateExistingFilter(index, 'column', event.target.value as string);
                        const filter = filters.find(
                          (filter) => filter.display_column === (event.target.value as string)
                        );
                        const columnType = filter ? filter.column_type : 'string';
                        updateExistingFilter(index, 'column_type', columnType);
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    >
                      {filters.map((filter, index) => (
                        <MenuItem key={filter.display_column} value={filter.display_column}>
                          {filter.display_column}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>

                  <FormControl fullWidth required>
                    <TextField
                      size="small"
                      id="select-operator"
                      value={appliedFilter.operator}
                      label="Select Operator"
                      select={true}
                      required
                      fullWidth
                      onChange={(event) => {
                        updateExistingFilter(index, 'operator', event.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    >
                      {appliedFilter.column_type
                        ? standardOperators[appliedFilter.column_type]?.map((op) => (
                            <MenuItem key={op} value={op}>
                              {op}
                            </MenuItem>
                          ))
                        : []}
                      []
                    </TextField>
                  </FormControl>

                  <TextField
                    size="small"
                    value={appliedFilter.value}
                    onChange={(event) => updateExistingFilter(index, 'value', event.target.value as string)}
                    placeholder="Enter value"
                  />
                </Stack>
              );
            })}

            <Stack spacing={1} direction="row" sx={{ justifyContent: 'space-between' }}>
              <VButton
                buttonText={'+ ADD'}
                buttonType="submit"
                endIcon={false}
                onClick={handleAddFilter}
                size="small"
                disabled={false}
                variant="text"
              />

              <Stack spacing={1} direction="row">
                <VButton
                  buttonText={'CANCEL'}
                  buttonType="submit"
                  endIcon={false}
                  startIcon={false}
                  onClick={handleClose}
                  size="small"
                  disabled={false}
                  variant="text"
                />

                <VButton
                  buttonText={'APPLY'}
                  buttonType="submit"
                  endIcon={false}
                  startIcon={false}
                  onClick={() => {
                    handleClose();
                    handleSubmit({ startDate, endDate });
                  }}
                  size="small"
                  disabled={false}
                  variant="text"
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Popover> */}
    </div>
  );
};

export default PromptPreviewFilter;
