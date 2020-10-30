export interface LinkData {
  lt_text: {
    value: string;
  };
}

export interface InternalLinkData extends LinkData {
  lt_link: {
    value: {
      fsType: "PageRef";
      identifier: string;
    };
  };
}

export interface ExternalLinkData extends LinkData {
  lt_url: {
    value: string;
  };
  lt_link_behavior: {
    value: {
      identifier: string;
    };
  };
}

export type LinkTemplate = {
  stringToReplace: string;
} & (
  | {
      type: "internal_link";
      data: InternalLinkData;
    }
  | {
      type: "external_link";
      data: ExternalLinkData;
    }
);

export const extractLinkMarkup = (
  text: string,
  createHrefAttributes: (
    type: string,
    data: Record<string, any>,
  ) => Record<string, any>,
) => {
  const regex = /<div data-fs-type="link\.(.*?)"><script type="application\/json">(.*?)<\/script><a>.*?<\/a><\/div>/gm;

  const linkTemplates: LinkTemplate[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    linkTemplates.push({
      stringToReplace: m[0],
      type: m[1] as any,
      data: JSON.parse(m[2]),
    });
  }
  let result = text;
  linkTemplates.forEach(data => {
    const hrefProps = createHrefAttributes(data.type, data.data);
    result = result.replace(
      data.stringToReplace,
      `<a ${Object.keys(hrefProps)
        .map(prop => hrefProps[prop] && `${prop}="${hrefProps[prop]}"`)
        .filter(Boolean)
        .join(" ")}>${data.data.lt_text.value}</a>`,
    );
  });
  return result;
};
