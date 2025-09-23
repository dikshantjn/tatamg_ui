import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  useTheme,
  Container,
  Chip,
  CircularProgress
} from '@mui/material';
import { teal } from '@mui/material/colors';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';
import { blogService } from '../../../services/User/HealthBlogs/blog.service';
import ImageIcon from '@mui/icons-material/Image';
import dummyImage from '../../../assets/dummyBlogImage.jpeg';

// Utility to remove first <h1>...</h1> from HTML string
function removeFirstH1(html) {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
}

const HealthBlogs = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({}); // { blogPostId: true/false }
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // null => All Topics

  const extractPosts = (res) => (res?.posts ?? res ?? []);

  const getCategoryName = (blog) => {
    const id = blog?.categoryId || blog?.category?.categoryId || blog?.category?.id || blog?.category_id;
    const fromObj = blog?.category?.name;
    const fromList = categories.find(c => c.categoryId === id)?.name;
    return fromObj || fromList || 'Category';
  };

  const loadBlogs = async (categoryId = null) => {
    try {
      setLoading(true);
      setError(null);
      const res = categoryId ? await blogService.getBlogsByCategory(categoryId) : await blogService.getAllBlogs();
      setBlogs(extractPosts(res));
    } catch (e) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load categories and initial blogs
    let mounted = true;
    (async () => {
      try {
        const cats = await blogService.getAllCategories();
        if (mounted) setCategories(cats || []);
      } catch (_) {
        // ignore category load errors; UI will just show "All Topics"
      }
      await loadBlogs(null);
    })();
    return () => { mounted = false; };
  }, []);

  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={28} />
        <Typography sx={{ mt: 1 }}>Loading blogs...</Typography>
      </Box>
    );
  }
  const featuredBlog = blogs[0];
  const recentArticles = blogs.slice(1);

  return (
    <Box sx={{ background: '#fafafa', minHeight: '100vh', py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        {/* Minimal Page Header */}
        <Box sx={{
          textAlign: 'center',
          mb: { xs: 2, md: 3 },
          py: { xs: 1, md: 1.5 },
        }}>
          <Typography variant="h4" fontWeight={700} color={theme.palette.primary.main} sx={{ mb: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Health Blog
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', fontSize: { xs: '0.95rem', md: '1rem' } }}>
            Expert tips, wellness guides, and the latest in health—curated for you.
          </Typography>
        </Box>
        {/* Categories Filter - horizontal scroll only */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              px: 1,
              '&::-webkit-scrollbar': { display: 'none' },
              justifyContent: { xs: 'flex-start', md: 'center' }
            }}
          >
            <Chip
              label="All Topics"
              color={selectedCategoryId === null ? 'primary' : 'default'}
              variant={selectedCategoryId === null ? 'filled' : 'outlined'}
              onClick={() => {
                if (selectedCategoryId !== null) {
                  setSelectedCategoryId(null);
                  loadBlogs(null);
                }
              }}
              sx={{ flexShrink: 0 }}
            />
            {categories.map(cat => (
              <Chip
                key={cat.categoryId}
                label={cat.name}
                color={selectedCategoryId === cat.categoryId ? 'primary' : 'default'}
                variant={selectedCategoryId === cat.categoryId ? 'filled' : 'outlined'}
                onClick={() => {
                  if (selectedCategoryId !== cat.categoryId) {
                    setSelectedCategoryId(cat.categoryId);
                    loadBlogs(cat.categoryId);
                  }
                }}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Box>
        </Box>
        {/* Selected Category Title */}
        <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
            {selectedCategoryId === null
              ? 'All Topics'
              : (categories.find(c => c.categoryId === selectedCategoryId)?.name || 'Topics')}
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          )}
          {!loading && blogs.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              No blogs found in this category.
            </Typography>
          )}
        </Box>
        {/* Featured Blog Section */}
        {featuredBlog && (
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 1.5, md: 3 },
            mb: { xs: 3, md: 4 },
            background: '#fff',
            border: '1px solid #e0e0e0',
            maxWidth: 1100,
            mx: 'auto',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
            <Grid item xs={12} md={7} zeroMinWidth>
                {imageError[featuredBlog.blogPostId] ? (
                  <Box sx={{
                    borderRadius: 3,
                    width: '100%',
                    aspectRatio: '16 / 9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                  }}>
                    <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                ) : (
              <CardMedia
                component="img"
                    image={dummyImage}
                alt={featuredBlog.title || 'Blog image'}
                    onError={() => handleImageError(featuredBlog.blogPostId)}
                sx={{
                  borderRadius: 3,
                  width: '100%',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  boxShadow: 2,
                }}
              />
                )}
            </Grid>
            <Grid item xs={12} md={5} zeroMinWidth>
              <Stack direction="row" spacing={1} mb={2}>
                {selectedCategoryId === null && (
                  <Chip label={getCategoryName(featuredBlog)} size="small" color="default" variant="outlined" />
                )}
              </Stack>
              <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: theme.palette.primary.main, mb: 1.5, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                {featuredBlog.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={{ xs: 1.5, md: 2 }} sx={{ lineHeight: 1.5 }}>
                  {removeFirstH1(featuredBlog.message).replace(/<[^>]+>/g, '').slice(0, 100)}...
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar sx={{ bgcolor: teal[500], width: 32, height: 32, fontSize: 16 }}>B</Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Blog Author</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(featuredBlog.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                endIcon={<OpenInNewIcon />}
                component={RouterLink}
                  to={`/health-blogs/${featuredBlog.blogPostId}`}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: { xs: 2, md: 3 }, py: { xs: 0.75, md: 1 } }}
              >
                Read More
              </Button>
            </Grid>
          </Grid>
        </Box>
        )}

        {/* Recent Articles Section */}
        <Box mb={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.primary.main, mb: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Our Recent Articles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay Informed with Our Latest Insights
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
          {recentArticles.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.blogPostId} display="flex" justifyContent="center">
              <Card
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  maxWidth: { xs: 360, md: 350 },
                  mx: 'auto',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                {imageError[blog.blogPostId] ? (
                  <Box sx={{
                    height: { xs: 160, md: 180 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                    <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                  </Box>
                ) : (
                <CardMedia
                  component="img"
                    image={dummyImage}
                  alt={blog.title || 'Blog image'}
                    onError={() => handleImageError(blog.blogPostId)}
                  sx={{
                    height: { xs: 150, md: 160 },
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                )}
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column' }}>
                  {selectedCategoryId === null && (
                    <Box sx={{ mb: 1 }}>
                      <Chip label={getCategoryName(blog)} size="small" color="default" variant="outlined" />
                    </Box>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                    <Avatar sx={{ bgcolor: teal[400], width: 20, height: 20, fontSize: 10 }}>B</Avatar>
                    <Typography variant="caption" fontWeight={500} color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.primary.main, mb: 1.25, fontSize: { xs: '0.98rem', md: '1rem' } }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.5, flexGrow: 1 }}>
                    {removeFirstH1(blog.message).replace(/<[^>]+>/g, '').slice(0, 70)}...
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    component={RouterLink}
                    to={`/health-blogs/${blog.blogPostId}`}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 500, 
                      py: 0.5,
                      px: 2,
                      fontSize: { xs: '0.85rem', md: '0.875rem' },
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HealthBlogs; 