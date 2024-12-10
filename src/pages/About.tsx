const About = () => {
  return (
    <div className="mx-auto md:mt-5 my-2 md:p-10 p-2 flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Drag and Drop Task manager</h1>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-rose-500">Features</h2>
        <ul className="flex list-disc flex-col gap-2 text-lg px-8">
          <li>Add multiple columns</li>
          <li>Sorting columns</li>
          <li>Delete and edit column</li>
          <li>Add task inside each column</li>
          <li>Delete and edit task</li>
          <li>Sorting tasks</li>
          <li>Drag and drop task to another tasks</li>
          <li className="text-red-500">
            Task title and column title can edit either clicking on edit button
            or by double clicking over it
          </li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-rose-500">Technologies</h2>
        <ul className="flex list-disc flex-col gap-2 text-lg px-8">
          <li>Dnd kit</li>
          <li>React icons</li>
          <li>React router</li>
          <li>Tailwind css</li>
          <li>Typescript</li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-rose-500">Installation</h2>
        <div className="flex flex-col gap-4 text-lg">
          <p>Clone or download the project from github</p>
          <div className="flex flex-col gap-2">
            <p>Run following command:</p>
            <ul className="list-disc px-8">
              <li>npm install</li>
              <li>npm run dev</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-rose-500">
          Future Improvement
        </h2>
        <ul className="flex list-disc flex-col gap-2 text-lg px-8">
          <li>User Authentication</li>
          <li>Implement Redux for state management</li>
          <li>Add subtask feature</li>
          <li>Undo and redo feature</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
