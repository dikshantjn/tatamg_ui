import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  useTheme,
  Container
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

  useEffect(() => {
    setLoading(true);
    blogService.getAllBlogs()
      .then(res => {
        setBlogs(res.posts || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load blogs');
        setLoading(false);
      });
  }, []);

  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>Loading blogs...</Typography></Box>;
  }
  if (error) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;
  }
  if (!blogs.length) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>No blogs found.</Typography></Box>;
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
          <Typography variant="h4" fontWeight={700} color={theme.palette.primary.main} sx={{ mb: 0.5 }}>
            Health Blog
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '0.95rem', md: '1rem' } }}>
            Expert tips, wellness guides, and the latest in health—curated for you.
          </Typography>
        </Box>
        {/* Featured Blog Section */}
        {featuredBlog && (
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            background: '#fff',
            border: '1px solid #e0e0e0',
            maxWidth: 1100,
            mx: 'auto',
          }}
        >
          <Grid container spacing={4} alignItems="center" direction="row" wrap="nowrap">
            <Grid item xs={7} md={7} zeroMinWidth>
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
            <Grid item xs={5} md={5} zeroMinWidth>
              <Stack direction="row" spacing={1} mb={2}>
                  {/* You can add a 'New' chip if needed */}
              </Stack>
              <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: theme.palette.primary.main, mb: 2 }}>
                {featuredBlog.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2} sx={{ lineHeight: 1.5 }}>
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
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
              >
                Read More
              </Button>
            </Grid>
          </Grid>
        </Box>
        )}

        {/* Recent Articles Section */}
        <Box mb={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.primary.main, mb: 1 }}>
            Our Recent Articles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay Informed with Our Latest Insights
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                  maxWidth: 350,
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
                    height: 180,
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
                    height: 160,
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                )}
                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                    <Avatar sx={{ bgcolor: teal[400], width: 20, height: 20, fontSize: 10 }}>B</Avatar>
                    <Typography variant="caption" fontWeight={500} color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.primary.main, mb: 1.5, fontSize: '1rem' }}>
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
                      fontSize: '0.875rem',
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