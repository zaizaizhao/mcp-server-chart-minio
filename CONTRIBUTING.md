# Contributing to MCP Server Chart MinIO

We welcome contributions to the MCP Server Chart MinIO project! This document provides guidelines for contributing.

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to maintain a welcoming environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](../../issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node.js version, etc.)

### Suggesting Features

1. Check existing [Issues](../../issues) to avoid duplicates
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Update documentation if needed
7. Commit with clear, descriptive messages
8. Push to your fork and submit a pull request

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/mcp-server-chart-minio.git
cd mcp-server-chart-minio
```

2. Install dependencies:
```bash
npm install
```

3. Start MinIO:
```bash
docker-compose up -d
```

4. Run in development mode:
```bash
npm run start:dev
```

5. Run tests:
```bash
npm test
```

## Coding Standards

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add JSDoc comments for public APIs
- Write unit tests for new functionality
- Keep functions small and focused
- Use meaningful variable and function names

## Adding New Chart Types

If you want to add support for a new chart type:

1. Add the chart type to the DTO in `src/chart-generators/dto/chart-generators.dto.ts`
2. Add the preprocessing function in `src/chart/chart-render.service.ts`
3. Add appropriate type mappings
4. Create tests for the new chart type
5. Update the README documentation
6. Add examples to the test dashboard

## Testing

- Write unit tests for new functions
- Add integration tests for new endpoints
- Test with the visual dashboard
- Ensure all existing tests continue to pass

## Documentation

- Update README.md for new features
- Add JSDoc comments for new APIs
- Update the OpenAPI schema if needed
- Include examples in your documentation

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Reach out to the maintainers

Thank you for your interest in contributing to MCP Server Chart MinIO!
