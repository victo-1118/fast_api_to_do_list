import os
import pytest

def main():
    os.environ["TESTING"] = "True"
    pytest.main()

if __name__ == "__main__":
    main()