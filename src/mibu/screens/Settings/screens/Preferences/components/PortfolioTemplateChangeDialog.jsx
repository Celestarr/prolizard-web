import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from "@mui/material";
import cx from "classnames";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const ValidationSchema = Yup.object({
  template: Yup.string()
    .required("You must select a template."),
});

const useStyles = makeStyles((theme) => ({
  card: {
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: 3,
    height: "100%",
  },
  cardActionArea: {
    height: "100%",
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
}));

const PortfolioTemplateChangeDialog = ({
  alertBoxMargin,
  error,
  isOpen,
  onAlertClose,
  onAlertCollapseEnter,
  onAlertCollapseExit,
  onClose,
  onSubmit,
  template,
  templates,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      aria-labelledby="portfolio-template-change-dialog"
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={isOpen}
    >
      <Formik
        enableReinitialize
        initialValues={{
          template: template.value,
        }}
        onSubmit={onSubmit}
        validationSchema={ValidationSchema}
      >
        {({
          dirty,
          // errors,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          // touched,
          values,
        }) => (
          <form className="mui-dialog-form" onSubmit={handleSubmit}>
            <DialogTitle
              id="portfolio-template-change-dialog"
            >
              Change Portfolio Template
            </DialogTitle>

            <DialogContent>
              <Collapse
                component={Box}
                in={error.show}
                mb={alertBoxMargin}
                onEntered={onAlertCollapseEnter}
                onExited={onAlertCollapseExit}
                width="100%"
              >
                <Alert
                  onClose={onAlertClose}
                  severity="error"
                >
                  {error.message}
                </Alert>
              </Collapse>

              <DialogContentText>
                Select a template.
              </DialogContentText>

              <Grid
                container
                spacing={2}
              >
                {templates.map((item) => (
                  <Grid
                    item
                    key={item.value}
                    md={3}
                    sm={4}
                  >
                    <Card
                      className={cx(classes.card, {
                        [classes.active]: values.template === item.value,
                      })}
                    >
                      <CardActionArea
                        className={classes.cardActionArea}
                        onClick={() => {
                          setFieldValue("template", item.value);
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1">
                            {item.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={isSubmitting || !dirty}
                type="submit"
              >
                Change
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PortfolioTemplateChangeDialog;
