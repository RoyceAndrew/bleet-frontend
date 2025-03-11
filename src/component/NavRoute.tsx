import { Link } from "react-router";

interface NavRouteProps {
  to: string;
  fill: string;
  iconActive?: string;
  icon: string;
  text: string;
}

export const NavRoute = (props: NavRouteProps) => {
  return (
    <Link
      className={`text-white hover:bg-slate-700 pl-3 pr-3 md:pl-1 mr-2 md:mr-0 md:pr-4 py-2 rounded-full md:rounded-3xl items-center gap-3 flex text-lg ${
        props.fill === props.to ? "font-extrabold" : "font-light"
      }`}
      to={props.to}
    >
      <i
        className={`bi ${
          props.fill === props.to ? props.iconActive || props.icon : props.icon
        } text-2xl `}
      ></i>
      <p className="hidden md:block">{props.text}</p>
    </Link>
  );
};
