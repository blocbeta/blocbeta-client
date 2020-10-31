import React, { useContext } from "react";
import {Form} from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import { useHistory } from "react-router-dom";
import { messages } from "../../messages";
import { AppContext } from "../../App";
import useApiResourceSelectOptions from "../../hooks/useApiResourceSelectOptions";
import { api, cache } from "../../hooks/useApi";
import { getOptions } from "../../helpers";
import { store } from "../../store";
import "./BoulderForm.css";

const BoulderForm = ({ submitting, submitLabel, onSubmit, ...rest }) => {
  const { locationPath } = useContext(AppContext);
  let history = useHistory();

  const grades = useApiResourceSelectOptions(cache.grades, api.grades.all);
  const holdTypes = useApiResourceSelectOptions(
    cache.holdTypes,
    api.holdTypes.all
  );
  const walls = useApiResourceSelectOptions(cache.walls, api.walls.all);
  const setters = useApiResourceSelectOptions(
    cache.setters,
    api.setters.all
  );
  const tags = useApiResourceSelectOptions(cache.tags, api.tags.all);
  const states = getOptions(store.states);

  return (
    <Form className="boulder-form" onSubmit={onSubmit} {...rest}>
      {/*<FormRow>*/}
      {/*  <Label>Name</Label>*/}
      {/*  <Input type="text" name="name" />*/}
      {/*</FormRow>*/}

      {/*<FormRow className="row-grade">*/}
      {/*  <Label>Grade</Label>*/}
      {/*  <Select*/}
      {/*    name="grade"*/}
      {/*    mirror="internalGrade"*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    options={grades}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow className="row-internal-grade">*/}
      {/*  <Label>Internal Grade</Label>*/}
      {/*  <Select*/}
      {/*    name="internalGrade"*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    options={grades}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow>*/}
      {/*  <Label>Hold Style</Label>*/}
      {/*  <Select*/}
      {/*    name="holdType"*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    options={holdTypes}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow className="row-start">*/}
      {/*  <Label>Start</Label>*/}
      {/*  <Select*/}
      {/*    name="startWall"*/}
      {/*    mirror="endWall"*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    options={walls}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow className="row-end">*/}
      {/*  <Label>End</Label>*/}
      {/*  <Select*/}
      {/*    name="endWall"*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    options={walls}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow>*/}
      {/*  <Label>Setters</Label>*/}
      {/*  <Select*/}
      {/*    name="setters"*/}
      {/*    multiple={true}*/}
      {/*    validate={{ required: messages.requiredOption }}*/}
      {/*    labelProperty="username"*/}
      {/*    options={setters}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<FormRow>*/}
      {/*  <Label>Tags</Label>*/}
      {/*  <Select name="tags" multiple={true} options={tags} />*/}
      {/*</FormRow>*/}

      {/*<FormRow>*/}
      {/*  <Label>Status</Label>*/}
      {/*  <Select name="status" options={states} />*/}
      {/*</FormRow>*/}

      {/*<FormRow>*/}
      {/*  <Label>Points</Label>*/}
      {/*  <Input*/}
      {/*    type="number"*/}
      {/*    name="points"*/}
      {/*    validate={{ required: messages.required }}*/}
      {/*  />*/}
      {/*</FormRow>*/}

      {/*<Button*/}
      {/*  secondary="true"*/}
      {/*  onClick={() => history.push(locationPath("/boulders"))}*/}
      {/*>*/}
      {/*  Cancel*/}
      {/*</Button>*/}

      {/*<Button type="submit" primary="true" disabled={submitting}>*/}
      {/*  {submitLabel}*/}
      {/*</Button>*/}
    </Form>
  );
};

export default BoulderForm;
