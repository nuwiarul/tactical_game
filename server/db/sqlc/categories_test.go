package db

import (
	"context"
	"fmt"
	"testing"

	"github.com/stretchr/testify/require"
)

/*
func TestCreateCategories(t *testing.T) {

	categories := []string{
		"Elektronik",
		"Fashion",
		"Makanan & Minuman",
		"Otomotif",
		"Kesehatan & Kecantikan",
		"Peralatan Rumah Tangga",
		"Hobi & Koleksi",
		"Olahraga",
		"Buku",
		"Mainan & Anak-anak",
		"Perlengkapan Kantor",
		"Seni & Kerajinan",
		"Musik",
		"Film",
		"Perjalanan",
		"Alat Berkebun",
		"Perlengkapan Hewan Peliharaan",
		"Furniture",
		"Peralatan Dapur",
		"Game",
		"Perangkat Lunak",
		"Aksesoris Ponsel",
		"Perlengkapan Bayi",
		"Barang Antik",
		"Perhiasan",
		"Fotografi",
		"Sepatu",
		"Tas",
		"Perlengkapan Camping",
		"Alat Musik",
		"Pakaian Dalam",
		"Pakaian Tidur",
		"Jaket",
		"Pakaian Renang",
		"Kacamata",
		"Jam Tangan",
		"Sepeda",
		"Skateboard",
		"Alat Pancing",
		"Perlengkapan Menjahit",
		"Peralatan Salon",
		"Peralatan Medis",
		"Tanaman Hias",
		"Bibit Tanaman",
		"Alat Pertanian",
		"Peralatan Listrik",
		"Bahan Bangunan",
		"Perlengkapan Mandi",
		"Produk Perawatan Rambut",
		"Parfum",
		"Kosmetik",
		"Alat Cukur",
		"Vitamin",
		"Obat Herbal",
		"Makanan Ringan",
		"Minuman Bersoda",
		"Kopi",
		"Teh",
		"Daging Segar",
		"Sayuran Organik",
		"Buah-buahan",
		"Rempah-rempah",
		"Peralatan Masak",
		"Alat Panggang",
		"Peralatan Barista",
		"Perlengkapan Memanggang",
		"Barang Pesta",
		"Dekorasi Rumah",
		"Alat Kebersihan",
		"Lampu",
		"Karpet",
		"Gorden",
		"Bantal",
		"Sprei",
		"Selimut",
		"Tempat Tidur",
		"Meja",
		"Kursi",
		"Rak Buku",
		"Lemari",
		"Kotak Penyimpanan",
		"Tas Sekolah",
		"Alat Tulis",
		"Buku Tulis",
		"Buku Bacaan",
		"Ensiklopedia",
		"Komik",
		"Majalah",
		"Korps",
		"Peta",
		"Globe",
		"Teropong",
		"Teleskop",
		"Peralatan Lab",
		"Alat Kimia",
		"Alat Biologi",
		"Alat Fisika",
		"Peralatan Geografi",
		"Perlengkapan Mendaki",
		"Pakaian Tahan Air",
	}

	//fmt.println(len(categories))

	for _, category := range categories {
		_, err := testStore.CreateCategory(context.Background(), CreateCategoryParams{
			Name: ToText(category),
		})
		require.NoError(t, err)
	}

}
*/

func TestCreateCategories(t *testing.T) {

	//fmt.println(len(categories))

	for i := 0; i < 75; i++ {
		_, err := testStore.CreateCategory(context.Background(), CreateCategoryParams{
			Name: ToText(fmt.Sprintf("Category %d", i)),
		})
		require.NoError(t, err)
	}

}
