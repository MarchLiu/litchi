# from setuptools import setup
from pathlib import Path
from setuptools import find_packages

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

__import__("setuptools").setup(name="jupyter-litchi",
                                     version="0.3.4",
                                     description="Litchi is a Jupyterlab extension for AI Client",
                                     long_description=long_description,
                                     long_description_content_type='text/markdown',
                                     author="marsliu",
                                     author_email="mars.liu@outlook.com",
                                     url="https://github.com/MarchLiu/litchi",
                                     license="MIT",
                                     keywords= ["jupyter", "jupyterlab", "jupyterlab-extension", "ai", "ollama", "kimi", "openai"],
                                     packages=find_packages(),
                                     package_data={
                                         'labextension': ['litchi/labextension/*'],
                                     },
                                 )
