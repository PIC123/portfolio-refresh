export default function ProjectsPage() {
    return (
      <section className="py-24 px-8">
        <h2 className="text-3xl font-pixel mb-8">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">Project 1</div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">Project 2</div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">Project 3</div>
        </div>
      </section>
    );
  }