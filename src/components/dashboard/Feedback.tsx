import { Input } from "../../pages/auth";
interface InputProps {
  title: string;
}

export const Textarea = ({ title }: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="" className="block mb-2 text-xl font-extralight">
        {title}
      </label>
      <textarea
        className="w-full border border-gray-300 p-4 font-semibold text-xl rounded"
        cols={20}
      />
    </div>
  );
};

export const Feedback = () => {
  return (
    <div className="flex justify-center">
      <form action="" className="w-3/5">
        <Input title={"First name"} type={"text"} />
        <Input title="Last name" type="text" />
        <Textarea title={"Your feedback"} />
        <button
          type="submit"
          className="w-full bg-light text-dark text-lg font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
