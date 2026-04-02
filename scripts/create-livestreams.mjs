import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: "726775e8-d5bd-441f-b990-04fb5d9cd8d3",
  tokenSecret: "zKayf6qtxzorMCw3Yg+tvr4WD9G4ENMShWMdsQ2urAoIj+bkp9cbp1+Xv9JPY5Y29LJZG/teAQm",
});

async function createLiveStream(name) {
  const stream = await mux.video.liveStreams.create({
    playback_policy: ["public"],
    new_asset_settings: { playback_policy: ["public"] },
    latency_mode: "standard",
    test: false,
  });
  
  console.log(`\n=== ${name} ===`);
  console.log(`Live Stream ID: ${stream.id}`);
  console.log(`Stream Key: ${stream.stream_key}`);
  console.log(`Playback ID: ${stream.playback_ids?.[0]?.id}`);
  console.log(`RTMP URL: rtmp://global-live.mux.com:5222/app`);
  console.log(`RTMP Stream Key: ${stream.stream_key}`);
  console.log(`Status: ${stream.status}`);
  
  return stream;
}

try {
  const ch1 = await createLiveStream("Channel 1 - ANDF Now!");
  const ch2 = await createLiveStream("Channel 2 - ANDF Now!");
  
  console.log("\n\n========================================");
  console.log("OBS SETUP INSTRUCTIONS");
  console.log("========================================");
  console.log("\nFor each channel in OBS:");
  console.log("  Settings → Stream → Service: Custom");
  console.log("  Server: rtmp://global-live.mux.com:5222/app");
  console.log("");
  console.log(`  Channel 1 Stream Key: ${ch1.stream_key}`);
  console.log(`  Channel 2 Stream Key: ${ch2.stream_key}`);
  console.log("");
  console.log("Playback IDs (for the live page):");
  console.log(`  Channel 1: ${ch1.playback_ids?.[0]?.id}`);
  console.log(`  Channel 2: ${ch2.playback_ids?.[0]?.id}`);
} catch (err) {
  console.error("Error:", err.message);
}
