import ImageCanvasEditor from './image-canvas-editor'

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Scrapbook Composer</h1>
      </div>
      <br></br>
      <ImageCanvasEditor />
    </main>
  )
}
