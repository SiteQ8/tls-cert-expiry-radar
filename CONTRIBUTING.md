# Contributing to TLS Cert Expiry Radar

First off, thank you for considering contributing to TLS Cert Expiry Radar! It's people like you that make this tool better for everyone.

## 🌟 Ways to Contribute

### 1. Report Bugs 🐛
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, browser)
- Screenshots if applicable

### 2. Suggest Features 💡
Have an idea? Open an issue with:
- Clear description of the feature
- Use cases and benefits
- Any implementation ideas

### 3. Submit Pull Requests 🔧
Ready to code? Here's how:

## Development Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/tls-cert-expiry-radar.git
cd tls-cert-expiry-radar

# Add upstream remote
git remote add upstream https://github.com/SiteQ8/tls-cert-expiry-radar.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, maintainable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run test  # When tests are available
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then open a Pull Request on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs for UI changes

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Use meaningful variable names
- Keep functions small and focused
- Use async/await over callbacks
- Add JSDoc comments for public APIs

### React Components
```typescript
// Good example
interface CertificateCardProps {
  domain: string;
  expiresIn: number;
  status: 'safe' | 'warning' | 'critical';
}

export function CertificateCard({ domain, expiresIn, status }: CertificateCardProps) {
  // Component logic
}
```

### CSS/Styling
- Use TailwindCSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use CSS variables for colors

## Adding New Features

### New Certificate Scanner Source
1. Create scanner in `src/lib/scanners/`
2. Implement `CertificateScanner` interface
3. Add tests
4. Update documentation

### New Notification Channel
1. Create notifier in `src/lib/notifiers/`
2. Implement `Notifier` interface
3. Add configuration schema
4. Update alert configuration UI

### New Visualization
1. Create component in `src/components/`
2. Use existing design tokens
3. Ensure mobile responsiveness
4. Add loading states

## Testing

### Manual Testing
- Test on Chrome, Firefox, Safari
- Test on mobile devices (iOS/Android)
- Test with different data sizes
- Test error scenarios

### Automated Testing (Coming Soon)
```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Documentation

### Code Documentation
- Add JSDoc comments to functions
- Document complex algorithms
- Include usage examples

### User Documentation
Update relevant docs in `/docs`:
- Installation guides
- Configuration examples
- Troubleshooting tips

## Community Guidelines

### Be Respectful
- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general chat
- **LinkedIn**: Connect with [@alenizi](https://www.linkedin.com/in/alenizi/)
- **Email**: Site@hotmail.com for security issues

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Featured on project website

## Questions?

Don't hesitate to ask! Open an issue with the `question` label or reach out directly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making TLS Cert Expiry Radar better! 🚀**

Built with ❤️ by [Ali AlEnezi](https://www.linkedin.com/in/alenizi/) and contributors.
