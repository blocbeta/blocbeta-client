import React, {Fragment} from "react";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {useForm, composeFormElement} from "../../index";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {handleErrors} from "../../hooks/useApi";

const RequestPasswordReset = () => {
  const history = useHistory();

  const {handleSubmit, observeField, submitting, formData} = useForm({
    email: null
  });

  const onSubmit = async (payload) => {

    try {
      await axios.post(`/api/request-reset`, payload);
      alert("You will receive instructions on how to reset your password via E-Mail.");
      history.push("/login");

    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <Fragment>
      <Meta title="Reset password"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Receive instructions on how to recover your password via E-Mail.
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
            <FormRow>
              {composeFormElement(
                "email",
                "E-Mail",
                formData.email,
                Input,
                observeField,
                {
                  type: "email",
                  required: true,
                  maxLength: 60
                }
              )}
            </FormRow>

            <Button
              type="submit"
              primary="true"
              loader={true}
              loading={submitting}
              disabled={submitting}>
              Send reset link
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default RequestPasswordReset;
