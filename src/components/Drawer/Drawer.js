import React, {createContext, Fragment} from 'react';
import './Drawer.css';
import classnames from "classnames";
import {Loader} from "../Loader/Loader";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import useClickOutside from "../../hooks/useClickOutside";

export const DrawerContext = createContext({
    drawerOpen: false,
    drawerLoading: false,
    setDrawerPages: [],
    drawerData: null,
    drawerActivePage: null
});

export const Drawer = ({open, data, closeHandler, activePage, pages, loading = true}) => {
    const classes = classnames("drawer", open ? "drawer--open" : "drawer--closed", loading ? "drawer--loading" : null);
    const page = pages.find(page => page.name === activePage);
    const drawerRef = React.useRef();

    useClickOutside(drawerRef, () => closeHandler());

    if (!pages) {
        return new Error("No pages passed to drawer");
    }

    const onKeyDown = [
        "keydown",
        (event) => {
            if (open && event.key === "Escape") {
                closeHandler();
            }
        }
    ];
    const onScroll = [
        "scroll",
        () => {
            closeHandler();
        },
        {
            passive: true
        }
    ];

    if (open) {
        window.addEventListener(...onScroll);
        window.addEventListener(...onKeyDown);
    } else {
        window.removeEventListener(...onScroll);
        window.removeEventListener(...onKeyDown);
    }

    if (loading || !data) {
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

                    <Button type="text" onClick={() => closeHandler()} className="close-drawer
                    ">
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
