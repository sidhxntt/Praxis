import { LinkPreview } from "@/components/Documentaton/AceternityComponents/Link_Preview/link-preview";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, file } = node.data.target.fields;
      const { url, contentType, details } = file;

      if (contentType.startsWith("image/")) {
        const { width, height } = details.image;
        return (
          <div>
            <Image
              src={`https:${url}`}
              alt={title || "Contentful Asset"}
              width={width || 500}
              height={height || 500}
            />
          </div>
        );
      } else if (contentType.startsWith("video/")) {
        const videoUrl = `https:${url}`;
        return (
          <div className="relative pb-16/9">
            {" "}
            <iframe
              src={videoUrl}
              title={title || "Contentful Video"}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <div>
          <p>Unsupported asset type</p>
        </div>
      );
    },

    [INLINES.HYPERLINK]: (node) => {
      const text = node.content.find(
        (item) => item.nodeType === "text"
      )?.value;
      return (
        <LinkPreview url={node.data.uri} className="font-bold">
          {text}
        </LinkPreview>
      );
    },
  },

  renderMark: {
    [MARKS.CODE]: (text) => {
      const codeText = typeof text === "string" ? text : String(text);

      return (
        <SyntaxHighlighter
          language="bash"
          style={vscDarkPlus}
          wrapLines
        >
          {codeText}
        </SyntaxHighlighter>
      );
    },
  },
};

export default renderOptions;
