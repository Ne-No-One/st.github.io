from django.shortcuts import render

def home(request):
    context = {
        'is_django': True
    }
    return render(request, 'index.html', context)
