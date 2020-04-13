import React, {Fragment} from 'react';
import './Drawer.css';
import classnames from "classnames";
import {Loader} from "../Loader/Loader";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import useClickOutside from "../../hooks/useClickOutside";

export const Drawer = ({open, closeHandler, data, pages, activePage = null, loading = true}) => {
    const classes = classnames("drawer", open ? "drawer--open" : "drawer--closed", loading ? "drawer--loading" : null);

    const drawerRef = React.useRef();
    useClickOutside(drawerRef, () => closeHandler());

    if (!pages) {
        return new Error("No pages passed to drawer");
    }

    let page = pages[0];

    if (activePage) {
        page = pages.find(page => page.id === activePage);
    }

    const onKeyDown = [
        "keydown",
        (event) => {
            if (open && event.key === "Escape") {
                closeHandler();
            }
        }
    ];

    if (open) {
        window.addEventListener(...onKeyDown);
    } else {
        window.removeEventListener(...onKeyDown);
    }

    if (loading) {
        return (
            <div className={classes}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={classes} ref={drawerRef}>
            <Fragment>
                <div className="drawer__header">
                    {page.header(data)}

                    <Button type="text" onClick={() => closeHandler()} className="close-drawer">
                        <Icon name="close"/>
                    </Button>
                </div>

                <div className="drawer__content">
                    {page.content(data)}
                </div>
            </Fragment>
        </div>
    )
};
