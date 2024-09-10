import { FC } from "react";
import meta from "@/config/meta.json";

interface Props {
  title: string;
}

const Meta: FC<Props> = ({ title }) => {
  return (
    <>
      <title>{title + meta.titleTemplate}</title>
      {title}
    </>
  );
};

export default Meta;
