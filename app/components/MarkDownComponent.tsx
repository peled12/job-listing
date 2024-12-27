import ReactMarkDown from "react-markdown";

const MarkDownComponent = ({ text }: { text: string | undefined }) => {
  const handleImageRender = (props: { src?: string; alt?: string }) => {
    if (!props.src) return null; // return nothing if the src is empty

    return (
      <img
        src={props.src}
        alt={props.alt || "Image"}
        className="w-[500px] max-h-[250px] object-cover"
      />
    );
  };

  return (
    <ReactMarkDown components={{ img: handleImageRender }}>
      {text}
    </ReactMarkDown>
  );
};

export default MarkDownComponent;
