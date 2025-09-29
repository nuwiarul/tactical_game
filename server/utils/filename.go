package utils

import (
	"strconv"
	"strings"
	"time"
)

func GenerateFilename() string {
	ts := time.Now().UTC().Format(time.RFC3339)
	return strings.Replace(ts, ":", "", -1)
}

func GenerateFilenameUnix() string {
	ts := time.Now().UTC().UnixMicro()
	return strconv.FormatInt(ts, 10)
}
