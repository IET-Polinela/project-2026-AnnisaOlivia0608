import random
from django.core.management.base import BaseCommand
from faker import Faker
from main_app.models import Report

fake = Faker('id_ID')


class Command(BaseCommand):
    help = 'Generate contextual fake reports'

    def add_arguments(self, parser):
        parser.add_argument('num_records', type=int, help='Jumlah data')

    def handle(self, *args, **kwargs):
        num_records = kwargs['num_records']

        context_data = {
            'Jalan Rusak': {
                'titles': [
                    'Lubang Besar di Tengah Jalan',
                    'Aspal Mengelupas Parah',
                    'Jalan Bergelombang Bahayakan Motor',
                    'Ambles di Dekat Drainase'
                ],
                'desc': 'Ditemukan kerusakan jalan yang cukup dalam.'
            },
            'Sampah': {
                'titles': [
                    'Tumpukan Sampah Liar',
                    'Bau Menyengat Sampah Menumpuk',
                    'TPS Melebihi Kapasitas',
                    'Sampah Menutup Saluran Air'
                ],
                'desc': 'Warga mengeluhkan penumpukan sampah.'
            },
            'Lampu Mati': {
                'titles': [
                    'Penerangan Jalan Umum Mati',
                    'Lampu Jalan Berkedip',
                    'Kabel Lampu Putus',
                    'Area Gelap Rawan Kriminalitas'
                ],
                'desc': 'Lampu jalan mati total.'
            },
            'Drainase': {
                'titles': [
                    'Saluran Air Mampet',
                    'Drainase Meluap Saat Hujan',
                    'Tutup Got Pecah',
                    'Penyumbatan Karena Sedimen'
                ],
                'desc': 'Saluran air tersumbat.'
            },
            'Keamanan': {
                'titles': [
                    'Aksi Vandalisme',
                    'Pencurian Kabel',
                    'Kerumunan Mencurigakan',
                    'Gangguan Ketertiban'
                ],
                'desc': 'Perlu patroli tambahan.'
            }
        }

        status_choices = ['REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED']

        for _ in range(num_records):
            category = random.choice(list(context_data.keys()))
            title_template = random.choice(context_data[category]['titles'])
            description_base = context_data[category]['desc']

            Report.objects.create(
                title=f"{title_template} - {fake.street_name()}",
                category=category,
                description=f"{description_base} Lokasi: {fake.street_address()}",
                location=f"{fake.city()}, {fake.address()}",
                status=random.choice(status_choices),
            )

        self.stdout.write(self.style.SUCCESS(f'{num_records} data berhasil dibuat!'))