package com.ayyappa.videomerger

import android.util.Log

class AyyappaVideoMerger {

    fun echo(value: String?): String? {
        Log.i("Echo", value ?: "null")

        return value
    }
}
