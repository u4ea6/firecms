import { PropsWithChildren, useCallback, useState } from "react";

import { Accordion, AccordionDetails, AccordionSummary, } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { darken } from "@mui/material/styles";

export function ExpandablePanel({
                                    title,
                                    children,
                                    expanded = true,
                                    padding = 1
                                }: PropsWithChildren<{
    title: React.ReactNode,
    expanded?: boolean;
    padding?: number | string;
}>) {

    const [expandedInternal, setExpandedInternal] = useState(expanded);
    return (
        <Accordion variant={"outlined"}
                   disableGutters
                   expanded={expandedInternal}
                   TransitionProps={{ unmountOnExit: true }}
                   onChange={useCallback((event: React.SyntheticEvent, expanded: boolean) => setExpandedInternal(expanded), [])}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                              sx={(theme) => ({
                                  minHeight: "56px",
                                  alignItems: "center",
                                  borderTopLeftRadius: `${theme.shape.borderRadius}px`,
                                  borderTopRightRadius: `${theme.shape.borderRadius}px`,
                                  borderBottomLeftRadius: !expandedInternal ? `${theme.shape.borderRadius}px` : undefined,
                                  borderBottomRightRadius: !expandedInternal ? `${theme.shape.borderRadius}px` : undefined,
                                  backgroundColor: theme.palette.mode === "dark"
                                      ? darken(theme.palette.background.paper, 0.1)
                                      : darken(theme.palette.background.paper, 0.05),
                                  "&.Mui-expanded": {
                                      borderBottom: `1px solid ${theme.palette.divider}`
                                  },
                                  // flexDirection: "row-reverse",
                                  "& .MuiAccordionSummary-content": {
                                      // marginLeft: theme.spacing(1)
                                  }
                              })}>
                {title}
            </AccordionSummary>
            <AccordionDetails sx={(theme) => ({
                padding: typeof padding === "string" ? padding : theme.spacing(padding),
            })}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}
