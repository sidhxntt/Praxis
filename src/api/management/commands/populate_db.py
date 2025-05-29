import random
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker
from api.models import Address, Album, Image, Post, Todo
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with fake data for existing users'

    def add_arguments(self, parser):
        parser.add_argument('--albums', type=int, default=5, help='Exact number of albums per user')
        parser.add_argument('--images', type=int, default=10, help='Exact number of images per album')
        parser.add_argument('--posts', type=int, default=10, help='Exact number of posts per user')
        parser.add_argument('--todos', type=int, default=10, help='Exact number of todos per user')

    def handle(self, *args, **options):
        fake = Faker()

        # Validations
        for key in ['albums', 'images', 'posts', 'todos']:
            if options[key] < 0:
                self.stderr.write(self.style.ERROR(f'--{key} must be >= 0'))
                return

        album_count = options['albums']
        image_count = options['images']
        post_count = options['posts']
        todo_count = options['todos']

        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.WARNING('No users found. Please create users first.'))
            return

        with transaction.atomic():
            for user in users:
                self.stdout.write(f'\nPopulating data for user: {user.username} ({user.email})')

                # Address (create if not exists)
                if not hasattr(user, 'address'):
                    Address.objects.create(
                        user=user,
                        street=fake.street_address(),
                        suite=fake.secondary_address(),
                        city=fake.city(),
                        zipcode=fake.zipcode(),
                        country=fake.country(),
                    )
                    self.stdout.write(self.style.SUCCESS('  Address created'))
                else:
                    self.stdout.write(self.style.WARNING('  Address already exists'))

                # Albums & Images
                for _ in range(album_count):
                    album = Album.objects.create(
                        user=user,
                        title=fake.catch_phrase(),
                        category=random.choice(['Travel', 'Work', 'Personal'])
                    )
                    images = [
                        Image(
                            album=album,
                            user=user,
                            title=fake.sentence(nb_words=4),
                            url=f"https://dummyimages.com/image/{random.randint(1, 10000)}.jpg",
                            thumbnail_url=f"https://dummyimages.com/thumb/{random.randint(1, 10000)}.jpg"

                        )
                        for _ in range(image_count)
                    ]
                    Image.objects.bulk_create(images)
                    self.stdout.write(f'  Created album "{album.title}" with {image_count} images')

                # Posts
                posts = [
                    Post(
                        user=user,
                        title=fake.sentence(),
                        body="\n\n".join(fake.paragraphs(nb=3))
                    )
                    for _ in range(post_count)
                ]
                Post.objects.bulk_create(posts)
                self.stdout.write(f'  Created {post_count} posts')

                # Todos
                todos = [
                    Todo(
                        user=user,
                        title=fake.sentence(),
                        completed=random.choice([True, False])
                    )
                    for _ in range(todo_count)
                ]
                Todo.objects.bulk_create(todos)
                self.stdout.write(f'  Created {todo_count} todos')

            self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully populated data for {len(users)} users'))

