/* eslint-disable react/no-array-index-key */

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  Link as MuiLink,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { green } from "@mui/material/colors";
import CompactGlobalFooter from "app/components/CompactGlobalFooter";
import GlobalSpinner from "app/components/GlobalSpinner";
import useCollapsibleAlert from "app/components/useCollapsibleAlert";
import { useLazySearchArticlesQuery } from "app/services/reference-management";
import { Formik, FormikHelpers } from "formik";
import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const SearchSchema = Yup.object({
  password: Yup.string()
    .required()
    .max(150, "Too long! Provide less than or equal to 150 characters."),
});

type FormValues = {
  password: string;
};

const THRESHOLD = 50;

const START_YEAR = 1970;
const CURRENT_YEAR = (new Date()).getFullYear();
const DEFAULT_YEAR_RANGE: [number, number] = [START_YEAR, CURRENT_YEAR];

type SortOption = "relevance" | "date";

export default function ArticleSearchScreen() {
  const theme = useTheme();
  const [searchArticles, {
    data,
    error: fetchError,
    isError: isFetchError,
    isFetching,
  }, lastPromiseInfo] = useLazySearchArticlesQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({ password: "" });
  const { ErrorComponent, setErrorMessage, clearError } = useCollapsibleAlert();
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [dateRange, setDateRange] = useState<[number, number]>([...DEFAULT_YEAR_RANGE]);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleDateRangeChange = useCallback(debounce((_event: Event, newValue: number | number[]) => {
    setDateRange(newValue as [number, number]);
  }, 250), [setDateRange]);

  // eslint-disable-next-line arrow-body-style
  const executeSearch = useCallback((page: number, query: string) => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });

    return searchArticles({
      page,
      query,
      sorting: sortBy,
      yearMax: dateRange[1],
      yearMin: dateRange[0],
    })
      .then(({ error: err }) => {
        if (err) {
          throw err;
        }
      })
      .catch((err) => {
        setErrorMessage(err?.data?.message);
      });
  }, [dateRange, searchArticles, setErrorMessage, sortBy]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    executeSearch(
      value - 1,
      formValues.password,
    );
  };

  const handleFormSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    clearError();
    setSubmitting(true);
    setFormValues(values);

    executeSearch(
      0,
      values.password,
    )
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (formValues.password.length) {
      executeSearch(0, formValues.password);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, executeSearch, sortBy]);

  const initialValues: FormValues = {
    password: "",
  };

  return (
    <>
      <Helmet title="Article Search" />

      <Container
        ref={containerRef}
        sx={{
          overflowY: "auto",
          py: 4,
        }}
      >
        <Typography variant="h4">
          Article Search
        </Typography>

        <Grid container spacing={6}>
          <Grid
            item
            md={8}
            sm={8}
            xs={12}
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                py: theme.spacing(4),
              }}
            >
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                validationSchema={SearchSchema}
              >
                {({
                  dirty,
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      autoComplete="off"
                      disabled={isFetching}
                      error={isFetchError}
                      fullWidth
                      helperText={isFetchError ? (fetchError as any).data.message : null}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              disabled={isFetching}
                              type="submit"
                              variant="contained"
                            >
                              Search
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Find articles"
                      required
                      // sx={{ "--Input-decoratorChildHeight": "45px" }}
                      type="text"
                      value={values.password}
                    />
                  </form>
                )}
              </Formik>
            </Box>
            <Grid
              container
              spacing={4}
              sx={{}}
            >
              {isFetching ? (
                <Grid item md={12}>
                  <CircularProgress color="primary" />
                </Grid>
              ) : null}
              {data ? data.results.map((item, idx) => (
                <Grid item key={item.id as string} md={12}>
                  <Paper
                    sx={{
                      paddingX: 4,
                      paddingY: 4,
                    }}
                  >
                    <MuiLink
                      component={Link}
                      target="_blank"
                      to={item.url as string}
                    >
                      <Typography gutterBottom variant="h5">
                        <Markdown>
                          {item.title as string}
                        </Markdown>
                      </Typography>
                    </MuiLink>
                    <Typography
                      color={green[600]}
                      gutterBottom
                      variant="body2"
                    >
                      <Markdown>
                        {item.subtitle as string}
                      </Markdown>
                    </Typography>
                    {item.description ? (
                      <Typography variant="body1">
                        <Markdown>
                          {item.description as string}
                        </Markdown>
                      </Typography>
                    ) : null}
                  </Paper>
                </Grid>
              )) : null}

              {data ? (
                <Grid
                  item
                  md={12}
                >
                  <Pagination
                    count={Math.ceil(data.count / 10)}
                    onChange={handlePageChange}
                    page={(lastPromiseInfo.lastArg.page || 0) + 1}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid
            item
            md={4}
            sm={4}
            xs={12}
          >
            <Grid container spacing={4}>
              <Grid item md={12}>
                <Paper
                  sx={{
                    paddingX: 4,
                    paddingY: 4,
                  }}
                >
                  <Typography variant="h4">
                    Filters
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Sorting
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="sorting"
                        name="sorting"
                        value={sortBy}
                        onChange={handleSortChange}
                      >
                        <FormControlLabel value="relevance" control={<Radio />} label="Relevance" />
                        <FormControlLabel value="date" control={<Radio />} label="Date" />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Date Range
                    </Typography>
                    <Slider
                      defaultValue={DEFAULT_YEAR_RANGE}
                      marks={[
                        { value: START_YEAR, label: `${START_YEAR}` },
                        { value: CURRENT_YEAR, label: `${CURRENT_YEAR}` },
                      ]}
                      max={CURRENT_YEAR}
                      min={START_YEAR}
                      onChange={handleDateRangeChange}
                      sx={{
                        "& .MuiSlider-markLabel[data-index=\"0\"]": {
                          transform: "translateX(0%)",
                        },
                        "& .MuiSlider-markLabel[data-index=\"1\"]": {
                          transform: "translateX(-100%)",
                        },
                      }}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
