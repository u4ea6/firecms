import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Container,
    Dialog,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import { getIn, useFormikContext } from "formik";
import {
    EntityCollection,
    getIconForView,
    TopNavigationResult,
    toSnakeCase,
    useNavigationContext
} from "@camberi/firecms";

// @ts-ignore
import { SearchIcons } from "./SelectIcons";

export function CollectionDetailsForm({ isNewCollection }: { isNewCollection: boolean }) {

    const navigation = useNavigationContext();

    const {
        values,
        setFieldValue,
        handleChange,
        touched,
        errors,
        dirty,
        isSubmitting,
        handleSubmit
    } = useFormikContext<EntityCollection>();

    const [iconDialogOpen, setIconDialogOpen] = useState(false);

    const topLevelNavigation = navigation.topLevelNavigation;
    if (!topLevelNavigation)
        throw Error("Navigation not ready in collection editor");

    const {
        groups
    }: TopNavigationResult = topLevelNavigation;

    useEffect(() => {
        const pathTouched = getIn(touched, "path");
        if (!pathTouched && isNewCollection && values.name) {
            setFieldValue("path", toSnakeCase(values.name))
        }

    }, [isNewCollection, touched, values.name]);

    const CollectionIcon = getIconForView(values);

    return (
        <Container maxWidth={"md"}
                   sx={{
                       p: 3,
                       height: "100%",
                       overflow: "scroll"
                   }}>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 3,
                    pb: 2
                }}>
                <Typography variant={!isNewCollection ? "h5" : "h4"}
                            sx={{ flexGrow: 1 }}>
                    {isNewCollection ? "New collection" : `${values.name} collection`}
                </Typography>
                <Tooltip title={"Change icon"}>
                    <IconButton
                        onClick={() => setIconDialogOpen(true)}
                    ><CollectionIcon/></IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <FormControl fullWidth
                                 required
                                 error={touched.name && Boolean(errors.name)}>
                        <InputLabel
                            htmlFor="name">Name</InputLabel>
                        <OutlinedInput
                            id="name"
                            value={values.name}
                            onChange={handleChange}
                            aria-describedby="name-helper-text"
                            label="Name"
                        />
                        <FormHelperText
                            id="name-helper-text">
                            {touched.name && Boolean(errors.name) ? errors.name : "Singular name of this collection (e.g. Product)"}
                        </FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <FormControl fullWidth
                                 required
                                 disabled={isSubmitting}
                                 error={touched.path && Boolean(errors.path)}>
                        <InputLabel
                            htmlFor="path">{"Path"}</InputLabel>
                        <OutlinedInput
                            id={"path"}
                            aria-describedby={`${"path"}-helper`}
                            onChange={handleChange}
                            value={values.path}
                            label={"Path"}
                            disabled={!isNewCollection}/>
                        <FormHelperText
                            id="path-helper">
                            {touched.path && Boolean(errors.path) ? errors.path : "Path that this collection is stored in"}
                        </FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth
                                 error={touched.group && Boolean(errors.group)}
                    >
                        <Autocomplete
                            id={"group"}
                            value={values.group}
                            fullWidth
                            freeSolo
                            options={groups}
                            onInputChange={(event, group) => {
                                setFieldValue("group", group ?? null);
                            }}
                            onChange={(event, group) => {
                                setFieldValue("group", group ?? null);
                            }}
                            getOptionLabel={(option) => option}
                            renderOption={(props, group, { selected }) => (
                                <li {...props}>
                                    {group}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params}
                                           disabled={isSubmitting}
                                           name={"group"}
                                           aria-describedby={"group-helper"}
                                           variant={"outlined"}
                                           label="Group"/>
                            )}
                        />
                        <FormHelperText
                            id="group-helper">
                            {touched.group && Boolean(errors.group) ? errors.group : "Group of the collection"}
                        </FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth
                                 error={touched.description && Boolean(errors.description)}>
                        <InputLabel
                            htmlFor="description">Description</InputLabel>
                        <OutlinedInput
                            id="description"
                            value={values.description}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            aria-describedby="description-helper-text"
                            label="Description"
                        />
                        <FormHelperText
                            id="description-helper-text">
                            {touched.description && Boolean(errors.description) ? errors.description : "Description of the collection, you can use markdown"}
                        </FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="size-label">
                            Default row size
                        </InputLabel>
                        <Select
                            labelId="size-label"
                            id="defaultSize"
                            name="defaultSize"
                            label="Default row size"
                            onChange={handleChange}
                            value={values.defaultSize}
                            renderValue={(value: any) => value.toUpperCase()}
                        >
                            {["xs", "s", "m", "l", "xl"].map((value) => (
                                <MenuItem
                                    key={`size-select-${value}`} value={value}>
                                    {value.toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>


            </Grid>

            <Box height={52}/>

            <Dialog
                keepMounted={false}
                open={iconDialogOpen}
                onClose={() => setIconDialogOpen(false)}
            >
                <Box p={1}>
                    <SearchIcons selectedIcon={values.icon}
                                 onIconSelected={(icon: string) => {
                                     setIconDialogOpen(false);
                                     setFieldValue("icon", icon);
                                 }}/>
                </Box>

            </Dialog>

        </Container>
    );
}
