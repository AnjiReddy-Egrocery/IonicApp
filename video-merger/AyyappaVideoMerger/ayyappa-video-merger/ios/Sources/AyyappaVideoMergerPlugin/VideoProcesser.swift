import Foundation
import AVFoundation
import UIKit
import CoreMedia
import Photos

class VideoProcessor {

    enum ProcessorError: Error {
        case invalidVideo
        case invalidPoster
        case exportFailed
    }

    typealias MergeCompletion = (Result<String, Error>) -> Void

    // MARK: - Public Entry

    func merge(
        videoPath: String,
        posterPath: String,
        name: String,
        role: String,
        completion: @escaping MergeCompletion
    ) {

        print("🚀 Video Merge Started")

        guard let videoURL = toURL(videoPath) else {
            completion(.failure(ProcessorError.invalidVideo))
            return
        }

        guard let posterURL = toURL(posterPath),
              let posterImage = UIImage(contentsOfFile: posterURL.path) else {

            completion(.failure(ProcessorError.invalidPoster))
            return
        }

        let asset = AVAsset(url: videoURL)

        guard let originalVideoTrack =
                asset.tracks(withMediaType: .video).first else {

            completion(.failure(ProcessorError.invalidVideo))
            return
        }

        let composition = AVMutableComposition()

        guard let compositionVideoTrack =
                composition.addMutableTrack(
                    withMediaType: .video,
                    preferredTrackID: kCMPersistentTrackID_Invalid
                ) else {

            completion(.failure(ProcessorError.exportFailed))
            return
        }

        do {

            try compositionVideoTrack.insertTimeRange(

                CMTimeRange(
                    start: .zero,
                    duration: asset.duration
                ),

                of: originalVideoTrack,
                at: .zero

            )

        } catch {

            completion(.failure(error))
            return
        }

        // ----------------------------------------------------
        // Copy Audio Track
        // ----------------------------------------------------

        if let audioTrack = asset.tracks(withMediaType: .audio).first,

           let compositionAudioTrack =
                composition.addMutableTrack(
                    withMediaType: .audio,
                    preferredTrackID: kCMPersistentTrackID_Invalid
                ) {

            do {

                try compositionAudioTrack.insertTimeRange(

                    CMTimeRange(
                        start: .zero,
                        duration: asset.duration
                    ),

                    of: audioTrack,
                    at: .zero

                )

            } catch {

                print("⚠️ Audio copy failed")
            }
        }

        continueMerge(

            asset: asset,

            composition: composition,

            videoTrack: compositionVideoTrack,

            originalTrack: originalVideoTrack,

            posterImage: posterImage,

            name: name,

            role: role,

            completion: completion

        )
    }

    // MARK: - Helpers

    private func toURL(_ path: String) -> URL? {

        if path.hasPrefix("file://") {

            return URL(string: path)

        }

        return URL(fileURLWithPath: path)
    }

    func fixedVideoSize(_ track: AVAssetTrack) -> CGSize {

        let transformed =
            track.naturalSize.applying(
                track.preferredTransform
            )

        return CGSize(
            width: abs(transformed.width),
            height: abs(transformed.height)
        )
    }


}

extension VideoProcessor {

    func continueMerge(

        asset: AVAsset,

        composition: AVMutableComposition,

        videoTrack: AVCompositionTrack,

        originalTrack: AVAssetTrack,

        posterImage: UIImage,

        name: String,

        role: String,

        completion: @escaping MergeCompletion

    ) {

         let videoSize = fixedVideoSize(originalTrack)
        let footerHeight: CGFloat = 250

        let canvasSize = CGSize(
            width: videoSize.width,
            height: videoSize.height + footerHeight
        )

        //---------------------------------------------------
        // Video Composition
        //---------------------------------------------------

        let videoComposition = AVMutableVideoComposition()

        videoComposition.renderSize = videoSize

        videoComposition.frameDuration =
            CMTime(value: 1, timescale: 30)

        //---------------------------------------------------
        // Instruction
        //---------------------------------------------------

        let instruction =
            AVMutableVideoCompositionInstruction()

        instruction.timeRange = CMTimeRange(
            start: .zero,
            duration: asset.duration
        )

        let layerInstruction =
            AVMutableVideoCompositionLayerInstruction(
                assetTrack: videoTrack
            )

        //---------------------------------------------------
        // Move video to TOP
        //---------------------------------------------------

    
let transform = originalTrack.preferredTransform



        layerInstruction.setTransform(
            transform,
            at: .zero
        )

        instruction.layerInstructions = [
            layerInstruction
        ]

        videoComposition.instructions = [
            instruction
        ]

        //---------------------------------------------------
        // Parent Layer
        //---------------------------------------------------

        let parentLayer = CALayer()

        parentLayer.frame = CGRect(
            origin: .zero,
            size: canvasSize
        )

        parentLayer.backgroundColor =
            UIColor.white.cgColor

            parentLayer.isGeometryFlipped = false

        //---------------------------------------------------
        // Video Layer
        //---------------------------------------------------

        let videoLayer = CALayer()

     videoLayer.frame = CGRect(
                    x: 0,
                    y: footerHeight,                      // ⬅️ తిరిగి 0 కి మార్చండి
                    width: videoSize.width,
                    height: videoSize.height
                )

        //---------------------------------------------------
        // Footer Background
        //---------------------------------------------------

       let footerLayer = CALayer()

                footerLayer.frame = CGRect(
                    x: 0,
                    y: 0,      // ⬅️ తిరిగి videoSize.height కి మార్చండి
                    width: videoSize.width,
                    height: footerHeight
                )

        footerLayer.backgroundColor =
            UIColor.white.cgColor

        //---------------------------------------------------
        // Orange Line
        //---------------------------------------------------

        let topLine = CALayer()

        topLine.frame = CGRect(
            x: 0,
            y: 0,
            width: videoSize.width,
            height: 8
        )

        topLine.backgroundColor =
            UIColor.orange.cgColor

        footerLayer.addSublayer(topLine)

        //---------------------------------------------------
        // Name
        //---------------------------------------------------

        let nameLayer = CATextLayer()

        nameLayer.string = name

        nameLayer.fontSize = 46

        nameLayer.foregroundColor =
            UIColor.black.cgColor

        nameLayer.contentsScale =
            UIScreen.main.scale

        nameLayer.alignmentMode = .left

        nameLayer.frame = CGRect(
            x: 40,
            y: 70,
            width: videoSize.width - 250,
            height: 60
        )

        //---------------------------------------------------
        // Role
        //---------------------------------------------------

        let roleLayer = CATextLayer()

        roleLayer.string = role

        roleLayer.fontSize = 36

        roleLayer.foregroundColor =
            UIColor.darkGray.cgColor

        roleLayer.contentsScale =
            UIScreen.main.scale

        roleLayer.frame = CGRect(
            x: 40,
            y: 135,
            width: videoSize.width - 250,
            height: 50
        )

        //---------------------------------------------------
        // Profile
        //---------------------------------------------------

        let profileLayer = CALayer()

        profileLayer.contents =
            posterImage.cgImage

        profileLayer.contentsGravity =
            .resizeAspectFill

        profileLayer.frame = CGRect(
            x: videoSize.width - 180,
            y: 35,
            width: 140,
            height: 140
        )

        profileLayer.cornerRadius = 70

        profileLayer.masksToBounds = true

        //---------------------------------------------------
        // Layer Order
        //---------------------------------------------------

        parentLayer.addSublayer(videoLayer)

        parentLayer.addSublayer(footerLayer)

        footerLayer.addSublayer(topLine)

        footerLayer.addSublayer(nameLayer)

        footerLayer.addSublayer(roleLayer)

        footerLayer.addSublayer(profileLayer)

        //---------------------------------------------------
        // Animation Tool
        //---------------------------------------------------

        videoComposition.animationTool =
            AVVideoCompositionCoreAnimationTool(

                postProcessingAsVideoLayer:
                    videoLayer,

                in: parentLayer
            )

        //---------------------------------------------------
        // Export
        //---------------------------------------------------

        exportVideo(

            composition: composition,

            videoComposition: videoComposition,

            completion: completion

        )
    }


    func exportVideo(

        composition: AVMutableComposition,

        videoComposition: AVMutableVideoComposition,

        completion: @escaping MergeCompletion

    ) {

        let outputURL = URL(
            fileURLWithPath:
                NSTemporaryDirectory() +
                "merged_\(UUID().uuidString).mp4"
        )

        try? FileManager.default.removeItem(at: outputURL)

        guard let exporter =
                AVAssetExportSession(

                    asset: composition,

                    presetName:
                        AVAssetExportPresetHighestQuality

                ) else {

            completion(.failure(
                ProcessorError.exportFailed
            ))

            return
        }

        exporter.outputURL = outputURL

        exporter.outputFileType = .mp4

        exporter.videoComposition = videoComposition

        exporter.shouldOptimizeForNetworkUse = true

        print("🚀 Export Started")

        exporter.exportAsynchronously {

            DispatchQueue.main.async {

                switch exporter.status {

                case .completed:

                    print("✅ Export Success")

                    PHPhotoLibrary.requestAuthorization {

                        status in

                        guard status == .authorized ||
                              status == .limited else {

                            completion(
                                .failure(
                                    ProcessorError.exportFailed
                                )
                            )

                            return
                        }

                        PHPhotoLibrary.shared()
                            .performChanges({

                                PHAssetChangeRequest
                                    .creationRequestForAssetFromVideo(
                                        atFileURL: outputURL
                                    )

                            }) {

                                saved,
                                error in

                                DispatchQueue.main.async {

                                    if saved {

                                        print("✅ Saved To Photos")

                                        completion(
                                            .success(
                                                outputURL.path
                                            )
                                        )

                                    } else {

                                        completion(
                                            .failure(
                                                error ??
                                                ProcessorError.exportFailed
                                            )
                                        )

                                    }

                                }

                            }

                    }

                case .failed:

                    print(
                        exporter.error?.localizedDescription
                        ?? "Export Failed"
                    )

                    completion(
                        .failure(
                            exporter.error ??
                            ProcessorError.exportFailed
                        )
                    )

                case .cancelled:

                    completion(
                        .failure(
                            ProcessorError.exportFailed
                        )
                    )

                default:
                    break
                }

            }

        }

    }


}