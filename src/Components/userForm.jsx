import React from "react";
import Joi from "@hapi/joi";
import { withSnackbar } from "notistack";
import Breadcrumb from "./breadcum";
import Form from "./common/form";

import { getDependencyTypes } from "../services/dependencyTypeService";
import { getDependency, saveDependency } from "../services/dependencyService";

import {
  Container,
  LinearProgress,
  Typography,
  Paper,
  Grid,
} from "@material-ui/core";

class DependencyForm extends Form {
  state = {
    data: {
      name_dependency: "",
      acronym_dependency: "",
      contact_dependency: "",
      city_dependency: "",
      email_dependency: "",
      web_dependency: "",
      phone_dependency: "",
      participationType_dependency: "",
      id_dependencyType: "",
    },
    dependencyTypes: [],

    errors: {},
    isLoading: false,
  };

  schema = Joi.object({
    id_dependency: Joi.number(),
    name_dependency: Joi.string().label("Nombre").max(500),
    acronym_dependency: Joi.string().alphanum().label("Sigla").max(10),
    contact_dependency: Joi.string().label("Contacto").max(150),
    city_dependency: Joi.string().label("Ciudad").max(100),
    email_dependency: Joi.string().label("Correo").max(100),
    web_dependency: Joi.string().label("Web").max(100),
    phone_dependency: Joi.string().label("Web").max(100),
    participationType_dependency: Joi.string().label("Tipo participación"),
    id_dependencyType: Joi.number().label("Tipo dependencia"),
  });

  async populateDependencyTypes() {
    const { data: dependencyTypes } = await getDependencyTypes();
    this.setState({ dependencyTypes });
  }
  async populateDependency() {
    try {
      const dependencyId = this.props.match.params.id; //Pasando por URL id movie
      if (dependencyId === "new") return; //Si si
      const { data: dependency } = await getDependency(dependencyId); //Si no.
      this.setState({ data: this.mapToViewModel(dependency) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.populateDependencyTypes();
    await this.populateDependency();
    this.setState({ isLoading: false });
  }

  mapToViewModel(dependency) {
    return {
      id_dependency: dependency.id_dependency,
      name_dependency: dependency.name_dependency,
      acronym_dependency: dependency.acronym_dependency,
      contact_dependency: dependency.contact_dependency,
      city_dependency: dependency.city_dependency,
      email_dependency: dependency.email_dependency,
      web_dependency: dependency.web_dependency,
      phone_dependency: dependency.phone_dependency,
      participationType_dependency: dependency.participationType_dependency,
      id_dependencyType: dependency.id_dependencyType,
    };
  }
  doSubmit = async () => {
    try {
      await saveDependency(this.state.data);
      this.props.enqueueSnackbar(
        `${this.state.data.acronym_dependency} fue guardado correctamente!`,
        { variant: "success" }
      );
      this.props.history.push("/dependencias");
    } catch (error) {
      this.props.enqueueSnackbar(`Se produjo un error. ${error}`, {
        variant: "error",
      });
    }
  };

  render() {
    const { data } = this.state;
    const listBreadcrumbs = [
      {
        path: "/",
        label: "Inicio",
      },
      {
        path: "/dependencias",
        label: "Dependencias",
      },
    ];

    const classes = {
      paper: {
        padding: "2em",
        color: "secondary",
      },
    };

    return (
      <Container maxWidth="lg">
        <Breadcrumb
          onListBreadcrumbs={listBreadcrumbs}
          lastLabel={"Dependencia"}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7} md={8}>
            <Paper style={classes.paper}>
              <Typography variant="h4" gutterBottom>
                Dependencia: <small>{data.acronym_dependency}</small>
                {this.state.isLoading && <LinearProgress color="secondary" />}
              </Typography>
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("name_dependency", "Nombre")}
                {this.renderInput("acronym_dependency", "Sigla")}
                {this.renderInput("contact_dependency", "Contacto")}
                {this.renderInput("city_dependency", "Ciudad")}
                {this.renderInput("email_dependency", "Correo")}
                {this.renderInput("web_dependency", "Sitio web")}
                {this.renderInput("phone_dependency", "Teléfono")}
                {this.renderTextarea(
                  "participationType_dependency",
                  "Tipo participación"
                )}
                {this.renderSelect(
                  "id_dependencyType",
                  "Tipo",
                  "name_dependencyType",
                  this.state.dependencyTypes
                )}

                {this.renderButton("Guardar")}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withSnackbar(DependencyForm);