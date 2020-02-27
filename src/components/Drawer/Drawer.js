import React from 'react';
import './Drawer.css';
import classnames from "classnames";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import {Loader} from "../Loader/Loader";

const Drawer = ({open, loading, closeHandler, header, content}) => {
    const classes = classnames("drawer", open ? "drawer--open" : "drawer--closed", loading ? "drawer--loading" : null);

    if (loading) {
        return (
            <div className={classes}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={classes}>
            <div className="drawer__header">
                {open && !loading && header}
                <Button type="text" onClick={() => closeHandler()} className="close-drawer">
                    <Icon name="close"/>
                </Button>
            </div>

            <div className="drawer__content">
                {open && !loading && content}
            </div>
        </div>
    )
};

export default Drawer;