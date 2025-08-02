import { Input } from "../../pages/auth";

export const Edit = () => {
  return (
    <>
      <form action="">
        <Input title={"Current password"} type={"text"} />
        <Input title="Email address" type="text" />
        <Input title="Username" type="text" />
        <Input title="Password" type="password" />
        <Input title="Confirm password" type="password" />
        <Input title="Contact phone" type="text" />
        <button
          type="submit"
          className="w-full bg-light text-dark text-lg font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
        >
          Save
        </button>
      </form>
    </>
  );
};
