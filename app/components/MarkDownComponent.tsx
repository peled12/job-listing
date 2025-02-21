import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Image from "next/image";

const MarkDownComponent = ({ text }: { text: string | undefined }) => {
  const handleImageRender = (props: { src?: string; alt?: string }) => {
    if (!props.src) return null; // return nothing if the src is empty

    return (
      <Image
        src={props.src}
        alt={props.alt || "Image"}
        className="w-[500px] max-h-[250px] object-cover"
      />
    );
  };

  return (
    <ReactMarkDown
      components={{ img: handleImageRender }}
      remarkPlugins={[remarkGfm, remarkBreaks]}
    >
      {text}
    </ReactMarkDown>
  );
};

export default MarkDownComponent;
