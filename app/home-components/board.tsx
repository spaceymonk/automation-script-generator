import ReactFlow, { Background, BackgroundVariant, Panel } from "reactflow";

export default function Board() {
  const infoColor = "#1D3557";

  return (
    <div className="h-full w-full px-6">
      <div className="bg-board w-full h-full rounded-xl">
        <ReactFlow proOptions={{ hideAttribution: true }}>
          <Background color={infoColor} variant={BackgroundVariant.Dots} />
          <Panel position={"bottom-right"}>
            <div className="bg-app rounded-md px-4 py-3 mr-3 mb-3 drop-shadow-md">
              <h3 className="text-info text-center font-semibold underline uppercase font-sans mb-5 select-none">
                drag to add
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* TODO: add blocks to here */}
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
