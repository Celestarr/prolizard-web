/* eslint-disable react/no-array-index-key */

import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CompactGlobalFooter from "app/components/CompactGlobalFooter";
import GlobalSpinner from "app/components/GlobalSpinner";
import useCollapsibleAlert from "app/components/useCollapsibleAlert";
import { useLazySearchArticlesQuery } from "app/services/reference-management";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Markdown from "react-markdown";
import * as Yup from "yup";

const SearchSchema = Yup.object({
  query: Yup.string()
    .required()
    .max(150, "Too long! Provide less than or equal to 150 characters."),
});

type FormValues = {
  query: string;
};

const THRESHOLD = 200;

export default function ArticleSearchScreen() {
  const theme = useTheme();
  const [searchArticles, {
    data,
    error: fetchError,
    isError: isFetchError,
    isFetching,
  }, lastPromiseInfo] = useLazySearchArticlesQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({ query: "" });
  const { ErrorComponent, setErrorMessage, clearError } = useCollapsibleAlert();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (isFetching || !data) return;

      const lastPage = lastPromiseInfo.lastArg.page as number;
      const shouldLoadMore = ((lastPage + 1) * 10) < data.count;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (shouldLoadMore && (scrollHeight - scrollTop - clientHeight < THRESHOLD)) {
        if (formValues.query.length) {
          searchArticles({
            page: lastPage + 1,
            query: formValues.query,
          })
            .then(({ error: err }) => {
              if (err) {
                throw err;
              }
            })
            .catch((err) => {
              setErrorMessage(err?.data?.message);
            })
            .finally(() => {
            });
        }
      }
    };

    document.addEventListener("scroll", handleScroll);
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener("scroll", handleScroll);
  }, [data, formValues, isFetching, lastPromiseInfo, searchArticles, setErrorMessage]);

  const handleFormSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    clearError();
    setSubmitting(true);
    setFormValues(values);

    searchArticles({
      page: 0,
      query: values.query,
    })
      .then(({ error: err }) => {
        if (err) {
          throw err;
        }
      })
      .catch((err) => {
        setErrorMessage(err?.data?.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const initialValues: FormValues = {
    query: "",
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
                      disabled={isFetching}
                      error={isFetchError}
                      helperText={isFetchError ? (fetchError as any).data.message : null}
                      name="query"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Find articles"
                      required
                      // sx={{ "--Input-decoratorChildHeight": "45px" }}
                      type="text"
                      value={values.query}
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
              {data ? data.results.map((item, idx) => (
                <Grid item key={item.id as string} md={12}>
                  <Paper
                    sx={{
                      paddingX: 4,
                      paddingY: 4,
                    }}
                  >
                    <Typography gutterBottom variant="h5">
                      <Markdown>
                        {item.title as string}
                      </Markdown>
                    </Typography>
                    <Typography gutterBottom variant="body2">
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
            </Grid>
          </Grid>
          <Grid
            item
            md={4}
            sm={4}
            xs={12}
          >
            <CompactGlobalFooter />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
