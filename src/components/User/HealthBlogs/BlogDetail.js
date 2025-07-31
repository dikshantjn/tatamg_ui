import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Avatar,
  Stack,
  Button,
  Chip,
  CardMedia,
  Grid,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { teal } from '@mui/material/colors';
import { blogService } from '../../../services/User/HealthBlogs/blog.service';
import ImageIcon from '@mui/icons-material/Image';
import dummyImage from '../../../assets/vitalii-pavlyshynets-kcRFW-Hje8Y-unsplash.jpg';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({}); // { blogPostId: true/false }

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch all blogs to get related, then fetch the current blog
    blogService.getAllBlogs()
      .then(res => {
        const posts = res.posts || [];
        const current = posts.find(b => b.blogPostId === id);
        setBlog(current);
        setRelated(posts.filter(b => b.blogPostId !== id).slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load blog');
        setLoading(false);
      });
  }, [id]);

  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>Loading blog...</Typography></Box>;
  }
  if (error || !blog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" color="error" align="center">Blog not found</Typography>
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="lg" sx={{ maxWidth: 1000 }}>
        {/* Main Content */}
        <Box sx={{ 
          background: '#fff', 
          borderRadius: 4, 
          p: { xs: 3, md: 6 }, 
          mb: 3, 
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Date in top-right corner */}
          <span className="blog-date-corner">{new Date(blog.createdAt).toLocaleDateString()}</span>
          {/* Back Button */}
          <Box sx={{ textAlign: 'left', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                color: teal[700],
                '&:hover': {
                  backgroundColor: 'rgba(0, 150, 136, 0.08)'
                }
              }}
        >
          Back to Blogs
        </Button>
          </Box>
          {/* Hero Image */}
          <Box sx={{ mb: 5, position: 'relative' }}>
            {imageError[blog.blogPostId] ? (
              <Box sx={{
                width: '100%',
                maxHeight: 400,
                minHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 3,
              }}>
                <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
              </Box>
            ) : (
              <CardMedia
                component="img"
              image={dummyImage}
            alt={blog.title}
            onError={() => handleImageError(blog.blogPostId)}
            sx={{
              width: '100%',
                maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 3,
              }}
            />
          )}
          </Box>

          {/* Article Header */}
          <Typography 
            variant="h2" 
            fontWeight={800} 
            color={teal[800]} 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
              mb: 3
            }}
          >
            {blog.title}
          </Typography>

          {/* Author Info */}

          <Divider sx={{ mb: 5, opacity: 0.3 }} />

          {/* Article Content */}
          <Box sx={{ 
            textAlign: 'left',
            maxWidth: 800,
            mx: 'auto',
            mb: 4
          }}>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.message }} />
          </Box>
        </Box>

        {/* Related Articles Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            mb={4} 
            color={teal[800]}
            sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            You may also like
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
            {related.map((rel) => (
              <Grid item xs={12} sm={6} md={4} key={rel.blogPostId} display="flex" justifyContent="center">
                <Box 
                  sx={{ 
                    background: '#fff',
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 350,
                    mx: 'auto',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                  onClick={() => navigate(`/health-blogs/${rel.blogPostId}`)}
                >
                  {imageError[rel.blogPostId] ? (
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
                      alt={rel.title}
                      onError={() => handleImageError(rel.blogPostId)}
                      sx={{ 
                        height: 180,
                        objectFit: 'cover',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                  )}
                  <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Avatar sx={{ bgcolor: teal[400], width: 28, height: 28, fontSize: 14 }}>B</Avatar>
                      <Typography variant="caption" fontWeight={600}>Blog Author</Typography>
                      <Typography variant="caption" color="text.secondary">• {new Date(rel.createdAt).toLocaleDateString()}</Typography>
                    </Stack>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={700} 
                      gutterBottom 
                      sx={{ color: teal[700] }}
                    >
                      {rel.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      mb={2}
                      sx={{ 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {rel.message.replace(/<[^>]+>/g, '').slice(0, 100)}...
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ 
                        borderRadius: 2, 
                        textTransform: 'none', 
                        fontWeight: 600, 
                        px: 0,
                        color: teal[700],
                        '&:hover': {
                          backgroundColor: 'rgba(0, 150, 136, 0.08)'
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogDetail; 