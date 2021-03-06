import React, { useState, useContext, useEffect, Fragment } from "react";
import { Meta } from "../../App";
import { FormRow } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import { extractErrorMessage } from "../../hooks/useApi";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Reset.css";
import {
  successToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { classNames } from "../../helper/classNames";
import { composeFormElement, useForm } from "../../hooks/useForm";
import { Button } from "../../components/Button/Button";

const Reset = () => {
  const [hashFound, setHashFound] = useState(false);
  const { dispatch } = useContext(ToastContext);

  const history = useHistory();
  const { hash } = useParams();

  const { handleSubmit, observeField, submitting, formData } = useForm({
    password: null,
  });

  const checkToken = async (hash) => {
    try {
      await axios.get(`/api/reset/${hash}`, false);
      setHashFound(true);
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  useEffect(() => {
    checkToken(hash);
  }, []);

  const onSubmit = async (payload) => {
    try {
      await axios.post(`/api/reset/${hash}`, payload);
      dispatch(
        successToast(
          "Your Password was successfully updated. You can now log in again."
        )
      );
      history.push("/login");
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  return (
    <Fragment>
      <Meta title="Reset password" />

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Choose your new password wisely.
        </h1>

        <div className="side-title-layout__content">
          <form
            onSubmit={(event) => handleSubmit(event, onSubmit)}
            className={classNames(
              "reset-form",
              !hashFound ? "reset-form--disabled" : null
            )}
          >
            <FormRow>
              {composeFormElement(
                "password",
                "Password",
                formData.password,
                Input,
                observeField,
                {
                  type: "password",
                  required: true,
                  minlength: 6,
                }
              )}
            </FormRow>

            <Button
              type="submit"
              primary="true"
              loader={true}
              loading={submitting}
              disabled={submitting}
            >
              Update password
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export { Reset };
