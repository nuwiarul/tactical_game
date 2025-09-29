package db

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/nuwiarul/twgdev/utils"

	"time"
)

func ToNumeric(value string) (pgtype.Numeric, error) {
	var numeric pgtype.Numeric
	err := numeric.Scan(value)
	if err != nil {
		return numeric, err
	}
	return numeric, nil
}

func ToNumericFromFloat(value float64) (pgtype.Numeric, error) {
	var numeric pgtype.Numeric
	err := numeric.Scan(value)
	if err != nil {
		return numeric, err
	}
	return numeric, nil
}

func ToFloat64(numeric pgtype.Numeric) (float64, error) {
	value, err := numeric.Float64Value()
	if err != nil {
		return 0, err
	}

	return value.Float64, nil
}

func ToInt64(numeric pgtype.Numeric) (int64, error) {
	value, err := numeric.Int64Value()
	if err != nil {
		return 0, err
	}

	return value.Int64, nil
}

func ToText(value string) pgtype.Text {
	return pgtype.Text{
		String: value,
		Valid:  true,
	}
}

func ToFloat8(value float64) pgtype.Float8 {
	return pgtype.Float8{
		Float64: value,
		Valid:   true,
	}
}

func ToTime(value time.Time) pgtype.Timestamp {
	return pgtype.Timestamp{
		Time:  value,
		Valid: true,
	}
}

func ToDate(value time.Time) pgtype.Date {
	return pgtype.Date{
		Time:  value,
		Valid: true,
	}
}

func ToTimestmapz(value time.Time) pgtype.Timestamptz {
	return pgtype.Timestamptz{
		Time:  value,
		Valid: true,
	}
}

func ToUuid(value string) (pgtype.UUID, error) {
	var uuid pgtype.UUID
	err := uuid.Scan(value)
	if err != nil {
		return uuid, err
	}
	return uuid, nil
}

func FromTimestamptz(value pgtype.Timestamptz) string {
	return utils.ToDatetimeFormat(value.Time)
}

func ToInt4(value int32) pgtype.Int4 {
	return pgtype.Int4{
		Int32: value,
		Valid: true,
	}
}

func ToInt2(value int16) pgtype.Int2 {
	return pgtype.Int2{
		Int16: value,
		Valid: true,
	}
}

func ToInt8(value int64) pgtype.Int8 {
	return pgtype.Int8{
		Int64: value,
		Valid: true,
	}
}
