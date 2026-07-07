import Foundation
import Capacitor

@objc(AyyappaVideoMergerPlugin)
public class AyyappaVideoMergerPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "AyyappaVideoMergerPlugin"
    public let jsName = "AyyappaVideoMerger"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "merge", returnType: CAPPluginReturnPromise)
    ]

    private let processor = VideoProcessor()

    @objc func merge(_ call: CAPPluginCall) {

        guard let video = call.getString("video"),
              let poster = call.getString("poster") ,
              let name = call.getString("name"),
              let role = call.getString("role")
              else {
            call.reject("Missing video or poster")
            return
        }

        processor.merge(
            videoPath: video,
            posterPath: poster,
            name: name, role: role

        ) { result in

            DispatchQueue.main.async {

                switch result {

                case .success(let output):
                    call.resolve([
                        "path": output
                    ])

                case .failure(let error):
                    call.reject(error.localizedDescription)
                }
            }
        }
    }
}