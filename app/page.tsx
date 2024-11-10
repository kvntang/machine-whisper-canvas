import ImageCanvasEditor from './image-canvas-editor';

export default function Home() {
  return (
    <main className="min-h-screen p-24 bg-black">
      <div className="flex justify-center">
      {/* <h1 className="text-3xl font-bold text-white font-silkscreen">Scrapbook Composer</h1> */}
      </div>
      <br />
      <ImageCanvasEditor />
    </main>
  );
}
