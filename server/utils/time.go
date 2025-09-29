package utils

import (
	"time"

	"github.com/jinzhu/now"
	"github.com/vigneshuvi/GoDateFormat"
)

const ZoneUtc8 = "Asia/Makassar"
const ZoneUtc7 = "Asia/Jakarta"

func GetCurrentDate() (string, error) {
	t, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", err
	}
	return ToDateFormat(t), err
}

func GetCurrentTime() (string, error) {
	t, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", err
	}
	return ToTimeFormat(t), nil
}

func GetBulan(bulan int) string {
	month := "Jan"

	if bulan == 1 {
		month = "Jan"
	} else if bulan == 2 {
		month = "Feb"
	} else if bulan == 3 {
		month = "Mar"
	} else if bulan == 4 {
		month = "Apr"
	} else if bulan == 5 {
		month = "Mei"
	} else if bulan == 6 {
		month = "Jun"
	} else if bulan == 7 {
		month = "Jul"
	} else if bulan == 8 {
		month = "Aug"
	} else if bulan == 9 {
		month = "Sep"
	} else if bulan == 10 {
		month = "Okt"
	} else if bulan == 11 {
		month = "Nop"
	} else if bulan == 12 {
		month = "Des"
	}

	return month
}

func ToDateFormat(waktu time.Time) string {
	return waktu.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd"))
}

func ToDatetimeFormat(waktu time.Time) string {
	return waktu.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"))
}

func ToDatetimeFormatToUTC8(waktu time.Time) (string, error) {

	local, err := TimeIn(waktu, ZoneUtc8)

	if err != nil {
		return "", err
	}

	return local.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss")), nil
}

func ToDatetimeFormatToUTC7(waktu time.Time) (string, error) {

	local, err := TimeIn(waktu, ZoneUtc7)

	if err != nil {
		return "", err
	}

	return local.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss")), nil
}

func ToTimeFormat(waktu time.Time) string {
	return waktu.Format(GoDateFormat.ConvertFormat("HH:MM:ss"))
}

func FromTimeFormat(waktu string) (time.Time, error) {
	t, err := time.Parse(GoDateFormat.ConvertFormat("HH:MM:ss"), waktu)
	if err != nil {
		return time.Now(), err
	}
	return t, nil

}

func FromDateFormat(waktu string) (time.Time, error) {
	tParse, err := time.Parse(GoDateFormat.ConvertFormat("yyyy-mm-dd"), waktu)
	if err != nil {
		return time.Now(), err
	}
	t, err := TimeIn(tParse, ZoneUtc8)
	if err != nil {
		return time.Now(), err
	}
	return t, nil

}

func FromDatetimeFormat(waktu string) (time.Time, error) {
	tParse, err := time.Parse(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"), waktu)
	if err != nil {
		return time.Now(), err
	}
	/*
		t, err := timeIn(tParse, ZoneUtc8)
		if err != nil {
			return time.Now(), err
		}

	*/
	return tParse, nil

}

func FromDatetimeFormatZone8(waktu string) (time.Time, error) {
	tParse, err := time.Parse(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"), waktu)
	if err != nil {
		return time.Now(), err
	}

	t, err := TimeIn(tParse, ZoneUtc8)
	if err != nil {
		return time.Now(), err
	}

	return t, nil

}

func FromDatetimeWithTZFormat(waktu string) (time.Time, error) {
	tParse, err := time.Parse(time.RFC3339, waktu)
	if err != nil {
		return time.Now(), err
	}
	t, err := TimeIn(tParse, ZoneUtc8)
	if err != nil {
		return time.Now(), err
	}
	return t, nil

}

func FromDatetimeWithZoneFormat(waktu string) (time.Time, error) {
	tParse, err := time.Parse(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss Z"), waktu)
	if err != nil {
		return time.Now(), err
	}
	t, err := TimeIn(tParse, ZoneUtc8)
	if err != nil {
		return time.Now(), err
	}
	return t, nil

}

func EndOfMonth(bulan int, tahun int) (string, string, error) {
	loc, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", "", err
	}
	t := time.Date(tahun, time.Month(bulan), 18, 17, 51, 49, 123456789, loc.Location())
	end := now.With(t).EndOfMonth()
	start := now.With(t).BeginningOfMonth()
	endDay := end.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd"))
	startDay := start.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd"))
	return startDay, endDay, nil
}

func MonthWithTimeString(bulan int, tahun int) (string, string, error) {
	loc, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", "", err
	}
	tStart := time.Date(tahun, time.Month(bulan), 18, 0, 0, 0, 123456789, loc.Location())
	tEnd := time.Date(tahun, time.Month(bulan), 18, 23, 59, 59, 123456789, loc.Location())
	end := now.With(tEnd).EndOfMonth()
	start := now.With(tStart).BeginningOfMonth()
	endDay := end.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"))
	startDay := start.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"))
	return startDay, endDay, nil
}

func MonthWithTime(bulan int, tahun int) (time.Time, time.Time, error) {
	/*
		loc, err := timeIn(time.Now(), ZoneUtc8)
		if err != nil {
			return loc, loc, err
		}

	*/
	//tStart := time.Date(tahun, time.Month(bulan), 18, 0, 0, 0, 123456789, loc.Location())
	//tEnd := time.Date(tahun, time.Month(bulan), 18, 23, 59, 59, 123456789, loc.Location())
	tStart := time.Date(tahun, time.Month(bulan), 18, 0, 0, 0, 123456789, time.Local)
	tEnd := time.Date(tahun, time.Month(bulan), 18, 23, 59, 59, 123456789, time.Local)
	end := now.With(tEnd).EndOfMonth()
	start := now.With(tStart).BeginningOfMonth()
	return start, end, nil
}

func MonthNowWithTime() (time.Time, time.Time, error) {
	t := time.Now()
	bulan := t.Month()
	tahun := t.Year()
	tStart := time.Date(tahun, time.Month(bulan), 18, 0, 0, 0, 123456789, time.Local)
	tEnd := time.Date(tahun, time.Month(bulan), 18, 23, 59, 59, 123456789, time.Local)
	end := now.With(tEnd).EndOfMonth()
	start := now.With(tStart).BeginningOfMonth()
	return start, end, nil
}

func TodayWithTimeString() (string, string, error) {
	loc, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", "", err
	}
	today := time.Now()
	tStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 123456789, loc.Location())
	tEnd := time.Date(today.Year(), today.Month(), today.Day(), 23, 59, 59, 123456789, loc.Location())
	endDay := tEnd.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"))
	startDay := tStart.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss"))
	return startDay, endDay, nil
}

func TodayWithTime() (time.Time, time.Time, error) {
	/*
		loc, err := timeIn(time.Now(), ZoneUtc8)
		if err != nil {
			return loc, loc, err
		}

	*/
	today := time.Now()
	//tStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 123456789, loc.Location())
	//tEnd := time.Date(today.Year(), today.Month(), today.Day(), 23, 59, 59, 123456789, loc.Location())
	tStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 123456789, time.Local)
	tEnd := time.Date(today.Year(), today.Month(), today.Day(), 23, 59, 59, 123456789, time.Local)
	return tStart, tEnd, nil
}

func BetweenWithTime(waktu string) (time.Time, time.Time, error) {
	tParse, err := time.Parse(GoDateFormat.ConvertFormat("yyyy-mm-dd"), waktu)
	loc, err := TimeIn(tParse, ZoneUtc8)
	if err != nil {
		return loc, loc, err
	}
	today := tParse
	tStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 123456789, loc.Location())
	tEnd := time.Date(today.Year(), today.Month(), today.Day(), 23, 59, 59, 123456789, loc.Location())
	//tStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 123456789, time.Local)
	//tEnd := time.Date(today.Year(), today.Month(), today.Day(), 23, 59, 59, 123456789, time.Local)
	return tStart, tEnd, nil
}

func EndOfYear(bulan int, tahun int) (string, string, error) {
	loc, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", "", err
	}
	t := time.Date(tahun, time.Month(bulan), 18, 17, 51, 49, 123456789, loc.Location())
	end := now.With(t).EndOfYear()
	start := now.With(t).BeginningOfYear()
	endDay := end.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd"))
	startDay := start.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd"))
	return startDay, endDay, nil
}

func GetCurrentDatetime() (string, error) {
	t, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return "", err
	}
	return t.Format(GoDateFormat.ConvertFormat("yyyy-mm-dd HH:MM:ss")), nil
}

func GetCurrentTimestamp() (int64, error) {
	t, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return 0, err
	}
	return t.UnixMilli(), nil
}

func CurrentDatetime() (time.Time, error) {
	t, err := TimeIn(time.Now(), ZoneUtc8)
	if err != nil {
		return t, err
	}
	return t, nil
}

func ConvertTimestamp(t time.Time) (time.Time, error) {
	t, err := TimeIn(t, ZoneUtc8)
	if err != nil {
		return t, err
	}
	return t, nil
}

func TimeIn(t time.Time, name string) (time.Time, error) {
	loc, err := time.LoadLocation(name)
	if err != nil {
		return time.Now(), err
	}
	return t.In(loc), nil
}

func FromTimestamp(timestamp int64) time.Time {
	return time.Unix(timestamp, 0)
}

func ToWitaTimezone(t time.Time) time.Time {
	timeIn, _ := TimeIn(t, ZoneUtc8)

	return timeIn
}
