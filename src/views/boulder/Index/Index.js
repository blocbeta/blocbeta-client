import React, {useState, useEffect, useContext, Fragment} from 'react';
import {Loader} from "../../../components/Loader/Loader";
import {resolveBoulder} from "../../../Helpers";
import ApiClient from "../../../ApiClient";
import Grade from "../../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../../components/HoldStyle/HoldStyle";
import Paragraph from "../../../components/Paragraph/Paragraph";
import Icon from "../../../components/Icon/Icon";
import Ascent from "../../../components/Ascent/Ascent";
import "./Index.css";
import Button from "../../../components/Button/Button";
import Banner from "../../../components/Banner/Banner";
import classnames from "classnames";

import {
    IndeterminateCheckbox,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableCell,
    TableFooter
} from "../../../components/Table/Table";

import {usePagination, useTable, useGlobalFilter, useSortBy, useRowSelect, useFilters} from "react-table";
import Context from "../../../Context";
import {TagInput} from "../../../components/TagInput/TagInput";
import {Link} from "react-router-dom";
import {Drawer, DrawerContext} from "../../../components/Drawer/Drawer";

const Bar = ({children}) => {
    return <div className="bar">
        {children}
    </div>
};

const Table = ({columns, data, editable = false}) => {
    const [tags, setTags] = useState([
        {
            id: 'ascent',
            value: 'todo'
        },
        {
            id: 'start',
            value: 'logowand'
        }
    ]);

    const removeTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        selectedFlatRows,
        setFilter,
        setAllFilters,
        state: {
            pageIndex,
            pageSize,
        },

    } = useTable({
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 20},
            autoResetFilters: false,
            autoResetSortBy: false,
            autoResetPage: false
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    );

    useEffect(() => {
        if (!tags) {
            setAllFilters({});
        }

        tags.map(tag => setFilter(tag.id, tag.value));
        setAllFilters(tags);
    }, [tags]);

    return <Fragment>
        <div className="filter">
            <Icon name="search" onClick={() => alert()}/>
            <TagInput tags={tags} onAdd={() => console.log('add')} onRemove={(id) => removeTag(id)}/>
            {/*<Icon name="filtermenu"/>*/}
        </div>

        <div
            className={classnames('table', 'table--boulder', editable ? 'table--editable' : null)} {...getTableProps()}>
            <TableHeader>
                {headerGroups.map(headerGroup => (
                    <React.Fragment>
                        {headerGroup.headers.map(column => (
                            <TableHeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}

                                <span className="sort-indicator">
                                {column.isSorted ? column.isSortedDesc ? <Icon name="down"/> : <Icon name="up"/> : ''}
                            </span>
                            </TableHeaderCell>
                        ))}
                    </React.Fragment>
                ))}
            </TableHeader>

            <div className="table-content" {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);

                    return (
                        <TableRow>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps({className: cell.column.className})}>{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
                    )
                })}
            </div>
        </div>

        <TableFooter
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageOptions={pageOptions}

            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}

            previousPage={previousPage}
            nextPage={nextPage}
        />

        {selectedFlatRows.length > 0 && (
            <Bar data={selectedFlatRows}>
                <div className="bar__summary">
                    <h2>Selected {selectedFlatRows.length} boulders:</h2>
                </div>

                <div className="bar__actions">
                    <Button text={true}>Deactivate</Button>
                    <Button text={true}>Prune Ascents</Button>
                </div>
            </Bar>
        )}
    </Fragment>
};

const Index = () => {
    const {
        setDrawerOpen,
        setDrawerLoading,
        setDrawerPages,
        setDrawerActivePage,
        setDrawerData
    } = useContext(DrawerContext);

    const [boulders, setBoulders] = useState(null);
    const [loading, setLoading] = useState(true);

    const showDetails = (boulderId) => {
        setDrawerOpen(true);
        setDrawerLoading(true);

        ApiClient.boulder.get(boulderId).then(data => {
            resolveBoulder(data);
            setDrawerData(data);
            setDrawerLoading(false);
        });
    };

    const selectionColumn = {
        Header: ({getToggleAllRowsSelectedProps}) => (
            <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
        ),
        id: 'selection',
        Cell: ({row}) => (
            <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
        ),
    };
    const columns = [
        {
            id: 'holdStyle',
            Header: 'holdStyle',
            accessor: 'holdStyle.name',
            Cell: ({cell}) => {
                return <HoldStyle name={cell.value}/>
            }
        },
        {
            id: 'grade',
            Header: 'Grade',
            accessor: 'grade.name',
            Cell: ({row}) => {
                return <Grade name={row.original.grade.name} color={row.original.grade.color}/>
            }
        },
        {
            id: 'points',
            Header: 'Points',
            accessor: 'points',
            Cell: ({cell}) => (
                <Paragraph>{cell.value} pts</Paragraph>
            )
        },
        {
            id: 'name',
            Header: 'Name',
            accessor: 'name',
            className: 'table-cell__name',
            Cell: ({cell, row}) => (
                <Fragment>
                    {Context.user.isAdmin() && (
                        <Link to={Context.getPath(`/boulder/${row.original.id}`)}> ✏</Link>
                    )}

                    <Button onClick={() => showDetails(row.original.id)}>
                        {cell.value} <Icon name="forward"/>
                    </Button>
                </Fragment>
            ),
        },
        {
            id: 'start',
            Header: 'Start',
            accessor: 'startWall.name',
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
        },
        {
            id: 'end',
            Header: 'End',
            accessor: 'endWall.name',
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
        },
        {
            id: 'date',
            Header: 'Date',
            accessor: 'createdAt',
            Cell: ({cell}) => {
                return (
                    <Paragraph>{moment(cell.value).format('D MMM')}</Paragraph>
                )
            }
        },
        {
            id: 'ascent',
            Header: 'Ascent',
            accessor: (row) => {
                if (row.me) {
                    return row.me.type;
                }

                return "todo";
            },
            Cell: ({row}) => {
                const ascent = row.original.me;

                let flashed = false;
                let topped = false;
                let resigned = false;

                if (ascent && ascent.type === 'flash') {
                    flashed = true
                }

                if (ascent && ascent.type === 'top') {
                    topped = true
                }

                if (ascent && ascent.type === 'resignation') {
                    resigned = true
                }

                return (
                    <React.Fragment>
                        <Ascent type="flash"
                                disabled={!flashed && ascent}
                                checked={flashed}
                                handler={() => ascentHandler(row.original.id, "flash", ascent ? ascent.id : null)}/>

                        <Ascent type="top"
                                disabled={!topped && ascent}
                                checked={topped}
                                handler={() => ascentHandler(row.original.id, "top", ascent ? ascent.id : null)}/>

                        <Ascent type="resign"
                                disabled={!resigned && ascent}
                                checked={resigned}
                                handler={() => ascentHandler(row.original.id, "resignation", ascent ? ascent.id : null)}/>
                    </React.Fragment>
                )
            }
        }
    ];

    if (Context.user.isAdmin()) {
        columns.unshift(selectionColumn)
    }

    const drawerPages = [
        {
            name: "details",
            header: (data) => {
                return (
                    <Fragment>
                        <HoldStyle name={data.holdStyle.name}/>
                        <h3>{data.name}</h3>
                    </Fragment>
                )
            },
            content: (data) => {
                return (
                    <Fragment>
                        {data.tags.length > 0 && (
                            <div className="detail__list">
                                <h4>Tags ({data.tags.length})</h4>

                                <ul>
                                    {data.tags.map(tag => {
                                        return <li>
                                            {tag.emoji} {tag.name}
                                        </li>
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="detail__list">
                            <h4>Ascents ({data.ascents.length ? data.ascents.length : 0})</h4>

                            {data.ascents.length > 0 && (
                                <ul>
                                    {data.ascents.map(ascent => {
                                        return <li>
                                            <Icon name={ascent.type}/>
                                            {ascent.user.username}

                                            <Button text={true} onClick={() => setDrawerActivePage('doubt')}>
                                                Doubt it
                                            </Button>
                                        </li>
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="detail__list">
                            <h4>Setters ({data.setters.length})</h4>
                            <ul>
                                {data.setters.map(setter => {
                                    return <li>
                                        {setter.username}
                                    </li>
                                })}
                            </ul>
                        </div>

                        <Button text={true}
                                onClick={() => setDrawerActivePage("error")}
                                className="report-error">
                            Report error
                        </Button>
                    </Fragment>
                )
            }
        },
        {
            name: "error",
            header: (data) => {
                return (
                    <Fragment>
                        <h3>
                            <strong>Report errror:</strong> {data.name}
                        </h3>
                    </Fragment>
                )
            },
            content: (data) => {
                return <Fragment>
                    error
                </Fragment>
            }
        },
        {
            name: "doubt",
            header: (data) => {
                return (
                    <Fragment>
                        <h3>
                            <strong>Doubt:</strong>
                        </h3>
                    </Fragment>
                )
            },
            content: (data) => {
                return <Fragment>
                    doubt
                </Fragment>
            }
        }
    ];

    useEffect(() => {
        async function getData() {
            const ascents = await ApiClient.getAscents().then(ascents => {
                return ascents.reduce((obj, item) => Object.assign(obj, {[item.boulderId]: item}), {});
            });

            const boulders = Context.storage.boulders.all();

            for (let boulder of boulders) {
                resolveBoulder(boulder);

                const ascentData = ascents[boulder.id];

                if (!ascentData) {
                    console.error(boulder.id + ' not found');
                    continue
                }

                boulder.points = ascentData.points;
                boulder.ascents = ascentData.ascents;
                boulder.me = ascentData.me;
            }

            return boulders
        }

        getData().then(data => {
            setBoulders(data);
            setLoading(false);
        });

        setDrawerPages(drawerPages);
        setDrawerActivePage("details");
    }, []);

    const ascentHandler = (boulderId, type, ascentId = null) => {
        const boulder = boulders.find(boulder => boulder.id === boulderId);

        if (!ascentId) {
            ApiClient.createAscent({
                'boulder': boulderId,
                'type': type
            }).then(data => {
                boulder.me = data.me;
                setBoulders([...boulders]);
            });

        } else {
            ApiClient.deleteAscent(ascentId).then(() => {
                boulder.me = null;
                setBoulders([...boulders]);
            });
        }
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <Banner>
                <Paragraph>Logowand <strong>・NEW NEW NEW・</strong></Paragraph>
            </Banner>

            <div className="container">
                <h1>Boulder ({boulders.length})</h1>
                <Table columns={columns} data={boulders} editable={Context.user.isAdmin()}/>
            </div>
        </Fragment>
    )
};

export default Index;