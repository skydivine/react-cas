import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TEXT_LABELS } from "../common/configTable";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { LinearProgress, Typography, Tooltip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from '@material-ui/icons/Delete';

class MembersTable extends Component {
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {},
        },
        MuiIconButton: {
          sizeSmall: {
            // Adjust spacing to reach minimal touch target hitbox
            marginLeft: 4,
            marginRight: 4,
            padding: 12,
          },
        },
      },
      props: {
        MuiTable: {
          size: "small",
        },
      },
    });

  getStatus = (value) => {
    if (value === 1) {
      return "Activo";
    }
  };
  render() {
    const roles = this.props.roles;
    const { members, onLoading } = this.props
    const columns = [
      {
        name: 'count',
        label: "ID",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1
        },
      },
      {
        name: "project_id",
        label: "Proyecto",
        options: {
          filter: false,
          display: "excluded",
        },
      },
      {
        name: "user_id",
        label: "Usuario",
        options: {
          filter: false,
          display: "excluded",
        },
      },
      {
        name: "created_at",
        label: "Fecha Creación",
        options: {
          filter: false,
          display: "excluded",
        },
      },
      {
        name: "user.fullname",
        label: "Nombre",
        options: {
          filter: true,
          sort: true,
          /* customBodyRender: (value, tableMeta) => {
            return (
              <Link
                style={{ textDecoration: "none" }}
                to={`/usuario/${tableMeta.rowData[2]}`}
              >
                {value}
              </Link>
            );
          }, */
        },
      },
      {
        name: "human_created_at",
        label: "Miembro desde",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <Tooltip title={`${tableMeta.rowData[3]}`} style={{ cursor: "pointer" }}>
                <span
                >
                  {`${value}`}
                </span>
              </Tooltip>
            )
          }
        },
      },
      {
        name: "role",
        label: "Rol o Permisos",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <Autocomplete
                name={'role'}
                options={roles}
                getOptionLabel={(role) => role.name
                }
                style={{ width: 300 }}
                value={value}
                getOptionSelected={(role, value) => { return (role.id === value.id) }}
                onChange={(event, newValue) => this.props.onChange(event, newValue, 'role_id', tableMeta.rowData[0], tableMeta.rowData[1])}
                renderInput={(params) => <TextField {...params} margin='normal' size="small" label="Elije el rol" variant="outlined" style={{ margin: '.25em' }} />}
              />
            )
          }
        },
      },
      {
        name: "",
        label: "Acciones",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <Link
                style={{ textDecoration: "none" }}
                to={`/proyecto/${tableMeta.rowData[0]}/miembros`}
              >
                <Tooltip title="Eliminar" style={{ cursor: "pointer" }}>
                  <DeleteIcon />
                </Tooltip>
              </Link>
            );
          },
        },
      },
      /*       {
              name: "active_group",
              label: "Estado",
              options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta) => {
                  return (
                    <Active
                      actived={value}
                      onClick={() => this.props.onActive(tableMeta.rowData[0])}
                    />
                  );
                },
              },
            }, */
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 20],
      selectableRows: 'none',
      textLabels: TEXT_LABELS,
      count: members.length,
      /* onRowClick: (rowData) => {
        console.log("RowClicked->", rowData);
      }, */
      onRowsDelete: (rowsDeleted) => {
        const items = members; //lista de todos los proyectos
        const itemsToDelete = rowsDeleted.data.map((item) => items[item.dataIndex]); //Array de todos los proyectos a borrar.
        this.props.onDelete(itemsToDelete);
      },
    };


    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable
          title={
            <Typography variant="h6">
              Miembros del Proyecto
              {onLoading && <LinearProgress color="secondary" />}
            </Typography>
          }
          data={members}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    );
  }
}

export default MembersTable;
