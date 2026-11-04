/* eslint-disable @next/next/no-css-tags -- Reuse the production site's shared header/footer stylesheet. */
import React, { type ReactNode } from "react";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { HouseScrollTop } from "@/components/house-scroll-top";
import "./house-designs.css";

export function HouseShell({children}:{children:ReactNode}){
 return <><HouseScrollTop/><link rel="stylesheet" href="/legacy/styles.min.css?v=20261104-2"/><a href="#house-main" className="hc-skip">ข้ามไปเนื้อหา</a>{React.createElement("nge-header")}<main id="house-main" className="hc-scope hc-page">{children}</main>{React.createElement("nge-footer")}<LegacyRuntimeScripts sources={["/legacy/site-config.js?v=20261104-2","/legacy/site-shell.js?v=20261104-2","/legacy/app.js?v=20261104-2"]}/></>;
}
