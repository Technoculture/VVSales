import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string },
) {
  return (
    <Link
      hrefAttrs={{
        // On web, launch the link in a new tab.
        target: "_blank",
      }}
      {...props}
      //this change is made to avoid the error of href not being a string in the Link component in github preview
      // @ts-ignore
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
