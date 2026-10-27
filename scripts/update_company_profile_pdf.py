"""Compatibility entry point for the redesigned Company Profile."""
from pathlib import Path
import runpy

runpy.run_path(str(Path(__file__).with_name("build_company_profile.py")), run_name="__main__")
