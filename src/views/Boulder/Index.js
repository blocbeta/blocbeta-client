import React, {
  Fragment,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Meta } from "../../App";
import { useQuery, queryCache, useMutation } from "react-query";
import {
  cache,
  allIdle,
  useApi,
  queryDefaults,
  extractErrorMessage,
} from "../../hooks/useApi";
import { LoadedContent } from "../../components/Loader/Loader";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import Grade from "../../components/Grade/Grade";
import { BlocBetaUIContext } from "../../components/BlocBetaUI";
import moment from "moment";
import {
  errorToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { classNames } from "../../helper/classNames";
import Forward from "../../components/Icon/Forward";
import BoulderDetails from "../../components/BoulderDetails/BoulderDetails";
import { Ascents } from "../../components/Ascents/Ascents";
import { Bar } from "../../components/Bar/Bar";
import { Button } from "../../components/Button/Button";
import { BoulderTable } from "../../components/BoulderTable/BoulderTable";
import { Input } from "../../components/Input/Input";
import { Drawer, DrawerContext } from "../../components/Drawer/Drawer";

const Index = () => {
  const { isAdmin } = useContext(BlocBetaUIContext);
  const { dispatch } = useContext(ToastContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  const [boulder, setBoulder] = useState(null);
  const [selected, setSelected] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState([
    {
      id: "ascent",
      value: "todo",
    },
    {
      id: "grade",
      value: "5",
    },
  ]);

  const boulderQuery = useQuery(
    cache.boulder,
    useApi("boulder"),
    queryDefaults
  );

  const ascentsQuery = useQuery(
    cache.ascents,
    useApi("ascents"),
    queryDefaults
  );

  const wallsQuery = useQuery(cache.walls, useApi("walls"), queryDefaults);

  const gradesQuery = useQuery(cache.grades, useApi("grades"), queryDefaults);

  const holdTypesQuery = useQuery(
    cache.holdTypes,
    useApi("holdTypes"),
    queryDefaults
  );

  const tagsQuery = useQuery(cache.tags, useApi("tags"), queryDefaults);

  const settersQuery = useQuery(
    cache.setters,
    useApi("setters"),
    queryDefaults
  );

  const [mutateAscentCreation] = useMutation(useApi("addAscent"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.ascents);
    },
  });

  const [mutateAscentDeletion] = useMutation(useApi("removeAscent"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.ascents);
    },
  });

  const [mutateMass] = useMutation(useApi("boulderMass"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.boulder);
    },
  });

  const idle = allIdle(
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    tagsQuery,
    settersQuery
  );

  const addHandler = async (boulderId, type) => {
    const payload = {
      boulder: boulderId,
      type: type,
    };

    try {
      await mutateAscentCreation({ payload });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const removeHandler = async (id) => {
    try {
      await mutateAscentDeletion({ id });
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  const renderAscents = useCallback((ascent) => {
    return (
      <Ascents
        boulderId={ascent.boulderId}
        addHandler={addHandler}
        removeHandler={removeHandler}
        ascent={ascent}
      />
    );
  }, []);

  const toggleDetails = (id) => {
    setBoulder(id);
    toggleDrawer(true);
  };

  const columns = useMemo(() => {
    return [
      {
        id: "holdType",
        accessor: "holdType",
        Header: "Hold",
        sortType: (a, b) => {
          return a.values.holdType.name > b.values.holdType.name ? -1 : 1;
        },
        Cell: ({ value }) => <HoldStyle image={value.image} />,
      },
      {
        id: "grade",
        accessor: "grade",
        Header: "Grade",
        sortType: (a, b) => {
          const gradeA = a.values.grade.internal
            ? a.values.grade.internal.name
            : a.values.grade.name;
          const gradeB = b.values.grade.internal
            ? b.values.grade.internal.name
            : b.values.grade.name;

          return gradeA > gradeB ? -1 : 1;
        },
        Cell: ({ value }) => {
          if (isAdmin && value.internal) {
            return (
              <Grade
                name={value.name}
                color={value.color}
                internalName={value.internal.name}
                internalColor={value.internal.color}
              />
            );
          }

          return <Grade name={value.name} color={value.color} />;
        },
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id].internal
              ? row.values[id].internal.name
              : row.values[id].name;

            return rowValue === filterValue;
          });
        },
      },
      {
        id: "points",
        accessor: "points",
        Header: "Points",
        sortType: (a, b) => {
          return a.values.points > b.values.points ? -1 : 1;
        },
        Cell: ({ value }) => `${value} pts`,
      },
      {
        id: "name",
        accessor: "name",
        Header: "Name",
        Cell: ({ value, row }) => {
          const active = boulder === row.original.id;

          return (
            <span
              onClick={() => toggleDetails(row.original.id)}
              className={classNames(
                "toggle-details",
                active ? "toggle-details__active" : null
              )}
            >
              {value} <Forward />
            </span>
          );
        },
      },
      {
        id: "start",
        accessor: "startWall.name",
        Header: "Start",
      },
      {
        id: "end",
        accessor: "endWall.name",
        Header: "End",
      },
      {
        id: "date",
        accessor: "createdAt",
        Header: "Date",
        Cell: ({ value }) => {
          return moment(value).format("l");
        },
      },
      {
        id: "ascent",
        accessor: "ascent",
        Header: "Ascent",
        sortType: (a, b) => {
          return a.values.ascent.type > b.values.ascent.type ? -1 : 1;
        },
        Cell: ({ value }) => renderAscents(value),
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id].type ? row.values[id].type : "todo";

            return rowValue === filterValue;
          });
        },
      },
    ];
  }, [isAdmin, boulder]);

  const mergedData = useMemo(() => {
    if (
      !boulderQuery.data ||
      !gradesQuery.data ||
      !holdTypesQuery.data ||
      !wallsQuery.data ||
      !settersQuery.data ||
      !tagsQuery.data ||
      !ascentsQuery.data
    ) {
      return [];
    }

    return boulderQuery.data.map((boulder) => {
      const ascent = ascentsQuery.data.find((ascent) => {
        return ascent.boulderId === boulder.id;
      });

      const grade = gradesQuery.data.find((grade) => {
        return grade.id === boulder.grade.id;
      });

      const internalGrade = gradesQuery.data.find((grade) => {
        if (!boulder.internalGrade) {
          return null;
        }

        return grade.id === boulder.internalGrade.id;
      });

      return {
        ...boulder,
        points: ascent.points,
        ascents: ascent.ascents,
        grade: {
          ...grade,
          internal: internalGrade,
        },
        holdType: holdTypesQuery.data.find((holdType) => {
          return holdType.id === boulder.holdType.id;
        }),
        startWall: wallsQuery.data.find((wall) => {
          return wall.id === boulder.startWall.id;
        }),
        endWall: wallsQuery.data.find((wall) => {
          if (!boulder.endWall) {
            return null;
          }

          return wall.id === boulder.endWall.id;
        }),
        setters: boulder.setters.map((boulderSetter) => {
          return settersQuery.data.find(
            (setter) => boulderSetter.id === setter.id
          );
        }),
        tags: boulder.tags.map((boulderTag) => {
          return tagsQuery.data.find((tag) => boulderTag.id === tag.id);
        }),
        ascent: ascent
          ? {
              id: ascent.me ? ascent.me.id : null,
              boulderId: ascent.boulderId,
              type: ascent.me ? ascent.me.type : null,
            }
          : null,
      };
    });
  }, [
    boulderQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    tagsQuery,
    settersQuery,
    ascentsQuery,
  ]);

  console.log(filters);

  return (
    <Fragment>
      <Meta title={"Boulder"} />

      <h1 className="t--alpha page-title">Boulder</h1>

      <LoadedContent loading={!idle}>
        <Input
          className="boulder-search"
          placeholder="Search"
          value={globalFilterValue}
          onClear={() => setGlobalFilterValue("")}
          onChange={(event) => {
            setGlobalFilterValue(event.target.value);
          }}
        />

        <BoulderTable
          columns={columns}
          data={mergedData}
          filters={filters}
          globalFilterValue={globalFilterValue}
          onSelectRows={(ids) => setSelected(ids)}
          isAdmin={isAdmin}
        />
      </LoadedContent>

      <Drawer onClose={() => setBoulder(null)}>
        {boulder && <BoulderDetails id={boulder} />}
      </Drawer>

      <Bar visible={selected.length > 0}>
        <span>Selected ({selected.length})</span>

        <span>
          <Button
            size={"small"}
            variant={"danger"}
            onClick={async () => {
              try {
                await mutateMass({
                  payload: {
                    items: selected,
                    operation: "prune-ascents",
                  },
                });
              } catch (error) {
                dispatch(errorToast(error));
              }
            }}
          >
            Prune Ascents
          </Button>

          <Button
            size={"small"}
            variant={"danger"}
            onClick={async () => {
              try {
                await mutateMass({
                  payload: {
                    items: selected,
                    operation: "deactivate",
                  },
                });
              } catch (error) {
                dispatch(errorToast(error));
              }
            }}
          >
            Deactivate
          </Button>
        </span>
      </Bar>
    </Fragment>
  );
};

export { Index };
