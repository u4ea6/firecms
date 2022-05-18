import { useCallback, useState } from "react";
import {
    Box,
    CardActionArea,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Typography
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { MoreVert } from "@mui/icons-material";

import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";

import { Link as ReactLink } from "react-router-dom";

import {
    DeleteConfirmationDialog,
    getIconForView,
    Markdown,
    TopNavigationEntry,
    TopNavigationResult,
    useNavigationContext
} from "@camberi/firecms";
import {
    useCollectionEditorController
} from "../useCollectionEditorController";
import { useConfigController } from "../useConfigController";

/**
 * Default entry view for the CMS under the path "/"
 * This component takes navigation as an input and renders cards
 * for each entry, including title and description.
 * @constructor
 * @category Components
 */
export function SassHomePage() {

    const navigation = useNavigationContext();
    const collectionEditorController = useCollectionEditorController();
    const collectionsController = useConfigController();

    if (!navigation.topLevelNavigation)
        throw Error("Navigation not ready in FireCMSHomePage");

    const navigationResult: TopNavigationResult = navigation.topLevelNavigation;
    const [collectionToBeDeleted, setCollectionToBeDeleted] = useState<TopNavigationEntry | undefined>();

    const onEditCollectionClicked = useCallback((entry: TopNavigationEntry) => {
        collectionEditorController?.editCollection(entry.path as string);
    }, [collectionEditorController]);

    const onDeleteCollectionClicked = useCallback((entry: TopNavigationEntry) => {
        setCollectionToBeDeleted(entry);
    }, []);

    const deleteCollection = useCallback(() => {
        if (collectionToBeDeleted?.path) {
            collectionsController?.deleteCollection(collectionToBeDeleted.path);
        }
        setCollectionToBeDeleted(undefined);
    }, [collectionToBeDeleted]);

    const {
        navigationEntries,
        groups
    } = navigationResult;

    const allGroups: Array<string | undefined> = [...groups, undefined];

    function buildAddCollectionNavigationCard(group?: string) {
        return (
            <Grid item xs={12}
                  sm={6}
                  md={4}
                  key={`nav_${group}_"add`}>
                <Paper variant={"outlined"}
                       sx={{ height: "100%", minHeight: 124 }}>
                    <CardActionArea
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }}
                        onClick={collectionEditorController
                            ? () => collectionEditorController.openNewCollectionDialog({
                                group
                            })
                            : undefined}
                    >

                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                width: "100%",
                                flexGrow: 1
                            }}>
                            <AddIcon color="primary"/>
                        </CardContent>

                    </CardActionArea>
                </Paper>
            </Grid>
        );
    }


    const canCreateCollections = collectionEditorController.configPermissions.createCollections;
    const canEditCollections = collectionEditorController.configPermissions.editCollections;
    const canDeleteCollections = collectionEditorController.configPermissions.deleteCollections;

    return (
        <Container>
            {allGroups.map((group, index) => {

                return (
                    <Box mt={6} mb={6} key={`group_${index}`}>

                        <Typography color={"textSecondary"}
                                    className={"weight-500"}>
                            {group?.toUpperCase() ?? "Ungrouped views".toUpperCase()}
                        </Typography>

                        <Divider/>

                        <Box mt={2}>
                            <Grid container spacing={2}>
                                {navigationEntries
                                    .filter((entry) => entry.group === group || (!entry.group && group === undefined)) // so we don't miss empty groups
                                    .map((entry) => {
                                        // const editable = canEditCollections && (entry.collection?.editable === undefined || entry.collection?.editable);
                                        // const deletable = canDeleteCollections && (entry.collection?.deletable === undefined || entry.collection?.deletable);
                                        return <Grid item xs={12}
                                                     sm={6}
                                                     md={4}
                                                     key={`nav_${entry.group}_${entry.name}`}>
                                            <NavigationCard entry={entry}
                                                            onEdit={canEditCollections
                                                                ? onEditCollectionClicked
                                                                : undefined}
                                                            onDelete={canDeleteCollections
                                                                ? onDeleteCollectionClicked
                                                                : undefined}/>
                                        </Grid>;
                                    })
                                }
                                {canCreateCollections && buildAddCollectionNavigationCard(group)}
                            </Grid>
                        </Box>
                    </Box>
                );
            })}

            <DeleteConfirmationDialog
                open={Boolean(collectionToBeDeleted)}
                onAccept={deleteCollection}
                onCancel={() => setCollectionToBeDeleted(undefined)}
                title={<>Delete this collection?</>}
                body={<> This will <b>not
                    delete any data</b>, only
                    the collection in the CMS</>}/>

        </Container>
    );
}

type NavigationCardProps = {
    entry: TopNavigationEntry,
    onDelete: ((entry: TopNavigationEntry) => void) | undefined,
    onEdit: ((entry: TopNavigationEntry) => void) | undefined
};

function NavigationCard({ entry, onDelete, onEdit }: NavigationCardProps) {

    const [menuAnchorEl, setMenuAnchorEl] = useState<any | null>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const CollectionIcon = getIconForView(entry.collection ?? entry.view);

    return (
        <Paper variant={"outlined"}>

            <CardActionArea
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minHeight: 248
                }}
                disableRipple={menuOpen}
                component={ReactLink}
                to={entry.url}
            >
                <CardContent
                    sx={{
                        flexGrow: 1,
                        width: "100%"
                    }}>

                    <Box sx={{
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between"
                    }}>

                        <CollectionIcon color={"disabled"}/>
                        <div>
                            {onDelete &&
                                <IconButton
                                    onClick={(event: React.MouseEvent) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setMenuAnchorEl(event.currentTarget);
                                    }}>
                                    <MoreVert fontSize={"small"}/>
                                </IconButton>
                            }

                            {onEdit &&
                                <IconButton
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        if (onEdit)
                                            onEdit(entry);
                                    }}>
                                    <SettingsIcon fontSize={"small"}/>
                                </IconButton>}
                        </div>
                    </Box>

                    <Typography gutterBottom variant="h5"
                                component="h2">
                        {entry.name}
                    </Typography>

                    {entry.description && <Typography variant="body2"
                                                      color="textSecondary"
                                                      component="div">
                        <Markdown source={entry.description}/>
                    </Typography>}
                </CardContent>

                <CardActions style={{ alignSelf: "flex-end" }}>

                    <Box p={1}>
                        <ArrowForwardIcon color="primary"/>
                    </Box>
                </CardActions>

            </CardActionArea>

            <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={() => setMenuAnchorEl(null)}
                elevation={1}
            >
                {onDelete && <MenuItem onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete(entry);
                    setMenuAnchorEl(undefined);
                }}>
                    <ListItemIcon>
                        <Delete/>
                    </ListItemIcon>
                    <ListItemText primary={"Delete"}/>
                </MenuItem>}

            </Menu>

        </Paper>);
}
