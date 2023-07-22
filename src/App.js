import "devextreme/dist/css/dx.dark.css";
import "./App.css";

import { DataGrid, Popup, Button, Form } from "devextreme-react";
import {
  Column,
  Button as GridButton,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import { useState, useReducer } from "react";
import { ButtonItem, SimpleItem } from "devextreme-react/form";

const employees = [
  { ID: 1, FirstName: "Sandra", LastName: "Johnson" },
  { ID: 2, FirstName: "James", LastName: "Scott" },
  { ID: 3, FirstName: "Nancy", LastName: "Smith" },
];

const initialState = {
  currentEvent: {},
  selectedEmployee: {},
  employees: employees,
  draftFirstName: "",
  draftLastName: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "selectEmployee": {
      return {
        ...state,
        selectedEmployee: action.selectedEmployee,
        draftFirstName: action.selectedEmployee.FirstName,
        draftLastName: action.selectedEmployee.LastName,
      };
    }
    case "addEmployee": {
      return {
        ...state,
        draftFirstName: "",
        draftLastName: "",
        selectedEmployee: {
          FirstName: "",
          LastName: "",
        },
      };
    }
    case "removeEmployee": {
      let newList = state.employees.slice();
      return {
        ...state,
        employees: newList.filter(
          (employee) => employee.ID !== action.employeeToRemove.ID
        ),
      };
    }
    case "changeFormField": {
      return {
        ...state,
        [action.changedFormField]: action.changedFormValue,
      };
    }
    case "applyFormChanges": {
      let employees;

      if (action.ID) {
        employees = state.employees.map((employee) => {
          if (employee.ID === action.ID) {
            return {
              ...employee,
              FirstName: action.draftFirstName,
              LastName: action.draftLastName,
            };
          } else return employee;
        });
      } else {
        employees = [...state.employees];
        employees.push({
          ID: employees.length + 1,
          FirstName: action.draftFirstName,
          LastName: action.draftLastName,
        });
      }
      return {
        ...state,
        employees: employees,
      };
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
};

function App() {
  const [visible, setVisible] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const editEvent = (e) => {
    dispatch({
      type: "selectEmployee",
      selectedEmployee: e.row.data,
    });
    togglePopup();
  };

  const deleteEvent = (e) => {
    dispatch({
      type: "removeEmployee",
      employeeToRemove: e.row.data,
    });
  };

  const addEvent = (e) => {
    dispatch({
      type: "addEmployee",
    });
    togglePopup();
  };

  const togglePopup = () => {
    setVisible(!visible);
  };

  const submitButtonOptions = {
    text: "Save",
    type: "success",
    useSubmitBehavior: true,
    onClick: (e) => {
      dispatch({
        type: "applyFormChanges",
        ID: state.selectedEmployee.ID,
        draftFirstName: state.draftFirstName,
        draftLastName: state.draftLastName,
      });
      togglePopup();
    },
  };

  const cancelButtonOptions = {
    text: "Cancel",
    onClick: togglePopup,
  };

  const firstNameTextBoxOptions = {
    showClearButton: true,
    value: state.draftFirstName,
    valueChangeEvent: "input",
    onValueChanged: (e) => {
      dispatch({
        type: "changeFormField",
        changedFormField: "draftFirstName",
        changedFormValue: e.value,
      });
    },
  };

  const lastNameTextBoxOptions = {
    showClearButton: true,
    value: state.draftLastName,
    valueChangeEvent: "input",
    onValueChanged: (e) => {
      dispatch({
        type: "changeFormField",
        changedFormField: "draftLastName",
        changedFormValue: e.value,
      });
    },
  };

  const renderPopupContent = () => {
    return (
      <Form>
        <SimpleItem
          dataField="FirstName"
          editorType="dxTextBox"
          editorOptions={firstNameTextBoxOptions}
        />
        <SimpleItem
          dataField="LastName"
          editorType="dxTextBox"
          editorOptions={lastNameTextBoxOptions}
        />
        <ButtonItem buttonOptions={submitButtonOptions} />
        <ButtonItem buttonOptions={cancelButtonOptions} />
      </Form>
    );
  };
  return (
    <div className="App">
      <DataGrid dataSource={state.employees} showBorders={true}>
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column type="buttons">
          <GridButton icon="edit" hint="Edit" onClick={editEvent} />
          <GridButton icon="remove" hint="Delete" onClick={deleteEvent} />
        </Column>
        <Toolbar>
          <Item location="after">
            <Button icon="add" onClick={addEvent} />
          </Item>
        </Toolbar>
      </DataGrid>
      <Popup
        hideOnOutsideClick={true}
        width={500}
        height={300}
        showTitle={false}
        visible={visible}
        contentRender={renderPopupContent}
        onHiding={togglePopup}
      />
    </div>
  );
}

export default App;
