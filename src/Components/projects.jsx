import React, { Component } from "react";
import ProjectsTable from "./projectsTable";
import { getProjects } from "../services/projectService";
import { getPrograms } from "../services/programService";
import { getResearchTypes } from "../services/researchTypeService";
import { getProjectTypes } from "../services/projectTypeService";
import { getCoverageTypes } from "../services/coverageTypeService";
import Breadcum from "./breadcum";
import { Container } from "@material-ui/core";
import { withSnackbar } from "notistack";

class Projects extends Component {
  state = {
    projects: [],
    programs: [],
    researchTypes: [],
    projectTypes: [],
    coverageTypes: [],
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { data: programs } = await getPrograms();
    const { data: researchTypes } = await getResearchTypes();
    const { data: projectTypes } = await getProjectTypes();
    const { data: coverageTypes } = await getCoverageTypes();
    //const dependencies = [{ name: "All Movies", _id: "" }, ...data];
    const { data: projects } = await getProjects();

    this.setState({
      projects,
      programs,
      researchTypes,
      projectTypes,
      coverageTypes,
      isLoading: false,
    });
  }

  getProject(id) {
    return this.state.projects.find((p) => p.id_project === id);
  }

  render() {
    const listBreadcrumbs = [
      {
        path: "/",
        label: "Inicio",
      },
    ];
    const classes = {
      table: {
        padding: "2em",
        color: "secondary",
      },
    };
    return (
      <main>
        <Container maxWidth="xl">
          <Breadcum
            onListBreadcrumbs={listBreadcrumbs}
            lastLabel={"Proyectos"}
          />
          <ProjectsTable
            datas={this.state.projects}
            onGetProject={this.getProject}
            onLoading={this.state.isLoading}
            style={classes.table}
          />
        </Container>
      </main>
    );
  }
}

export default withSnackbar(Projects);
